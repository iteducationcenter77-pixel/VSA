import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { createClient } from '@supabase/supabase-js';

// Universal Vercel Database Handler (Vercel Postgres + Supabase fallback)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const table = searchParams.get('table') || 'students';

  // 1. Check if Vercel Postgres is configured via POSTGRES_URL
  if (process.env.POSTGRES_URL) {
    try {
      if (table === 'students') {
        // Auto-create table if needed
        await sql`
          CREATE TABLE IF NOT EXISTS vsa_students (
            student_id VARCHAR(100) PRIMARY KEY,
            full_name VARCHAR(255) NOT NULL,
            course_name VARCHAR(255),
            batch_time VARCHAR(100),
            phone VARCHAR(50),
            email VARCHAR(255),
            enrollment_date VARCHAR(100),
            status VARCHAR(50),
            qr_token VARCHAR(255),
            photo_url TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `;
        const { rows } = await sql`SELECT * FROM vsa_students ORDER BY updated_at DESC;`;
        return NextResponse.json({ success: true, provider: 'vercel_postgres', data: rows });
      }

      if (table === 'attendance') {
        await sql`
          CREATE TABLE IF NOT EXISTS vsa_attendance (
            id VARCHAR(100) PRIMARY KEY,
            student_id VARCHAR(100) NOT NULL,
            student_name VARCHAR(255),
            date VARCHAR(50),
            arrival_time VARCHAR(50),
            departure_time VARCHAR(50),
            total_hours NUMERIC,
            status VARCHAR(50),
            recorded_by VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `;
        const { rows } = await sql`SELECT * FROM vsa_attendance ORDER BY created_at DESC LIMIT 500;`;
        return NextResponse.json({ success: true, provider: 'vercel_postgres', data: rows });
      }
    } catch (err: unknown) {
      console.error('Vercel Postgres GET error:', err);
      return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
    }
  }

  // 2. Check if Supabase Postgres is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, provider: 'supabase', data });
    } catch (err: unknown) {
      return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
    }
  }

  // 3. Fallback: No server env configured yet
  return NextResponse.json({
    success: true,
    provider: 'local_storage_ready',
    message: 'Cloud database variables (POSTGRES_URL or NEXT_PUBLIC_SUPABASE_URL) not set on server. Using VSA Browser & Cloud Sync Engine.',
    data: [],
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, table, records } = body;

    // 1. Sync to Vercel Postgres if configured
    if (process.env.POSTGRES_URL) {
      if (table === 'students' && Array.isArray(records)) {
        await sql`
          CREATE TABLE IF NOT EXISTS vsa_students (
            student_id VARCHAR(100) PRIMARY KEY,
            full_name VARCHAR(255) NOT NULL,
            course_name VARCHAR(255),
            batch_time VARCHAR(100),
            phone VARCHAR(50),
            email VARCHAR(255),
            enrollment_date VARCHAR(100),
            status VARCHAR(50),
            qr_token VARCHAR(255),
            photo_url TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `;

        for (const s of records) {
          await sql`
            INSERT INTO vsa_students (
              student_id, full_name, course_name, batch_time, phone, email, enrollment_date, status, qr_token, photo_url
            )
            VALUES (
              ${s.student_id}, ${s.full_name}, ${s.course_name || ''}, ${s.batch_time || ''},
              ${s.phone || ''}, ${s.email || ''}, ${s.enrollment_date || ''}, ${s.status || 'Active'},
              ${s.qr_token || ''}, ${s.photo_url || ''}
            )
            ON CONFLICT (student_id) DO UPDATE SET
              full_name = EXCLUDED.full_name,
              course_name = EXCLUDED.course_name,
              batch_time = EXCLUDED.batch_time,
              phone = EXCLUDED.phone,
              email = EXCLUDED.email,
              photo_url = EXCLUDED.photo_url,
              updated_at = CURRENT_TIMESTAMP;
          `;
        }
        return NextResponse.json({ success: true, provider: 'vercel_postgres', syncedCount: records.length });
      }

      if (table === 'attendance' && Array.isArray(records)) {
        await sql`
          CREATE TABLE IF NOT EXISTS vsa_attendance (
            id VARCHAR(100) PRIMARY KEY,
            student_id VARCHAR(100) NOT NULL,
            student_name VARCHAR(255),
            date VARCHAR(50),
            arrival_time VARCHAR(50),
            departure_time VARCHAR(50),
            total_hours NUMERIC,
            status VARCHAR(50),
            recorded_by VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `;

        for (const a of records) {
          await sql`
            INSERT INTO vsa_attendance (
              id, student_id, student_name, date, arrival_time, departure_time, total_hours, status, recorded_by
            )
            VALUES (
              ${a.id}, ${a.student_id}, ${a.student_name}, ${a.date}, ${a.arrival_time || ''},
              ${a.departure_time || null}, ${a.total_hours || 0}, ${a.status || 'Present'}, ${a.recorded_by || 'QR'}
            )
            ON CONFLICT (id) DO UPDATE SET
              departure_time = EXCLUDED.departure_time,
              total_hours = EXCLUDED.total_hours,
              status = EXCLUDED.status;
          `;
        }
        return NextResponse.json({ success: true, provider: 'vercel_postgres', syncedCount: records.length });
      }
    }

    // 2. Sync to Supabase if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error } = await supabase.from(table).upsert(records);
      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, provider: 'supabase', syncedCount: records?.length });
    }

    // 3. Graceful confirmation response
    return NextResponse.json({
      success: true,
      provider: 'client_cloud_ready',
      message: 'Cloud sync endpoint active. Set POSTGRES_URL on Vercel to store persistently in Vercel Postgres.',
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
