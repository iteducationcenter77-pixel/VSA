import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sql } from '@vercel/postgres';

// Universal Cloud Database API Route (Supabase + Vercel Postgres support)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const table = searchParams.get('table') || 'students';

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;

  // 1. SUPABASE DATABASE (Primary Choice)
  if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const targetTable = table === 'students' ? 'vsa_students' : 'vsa_attendance';

      const { data, error } = await supabase
        .from(targetTable)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // If table doesn't exist yet or query fails, return empty array gracefully
        return NextResponse.json({ success: true, provider: 'supabase', data: [], note: error.message });
      }

      return NextResponse.json({ success: true, provider: 'supabase', data: data || [] });
    } catch (err: unknown) {
      console.error('Supabase GET Error:', err);
      return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
    }
  }

  // 2. VERCEL POSTGRES (Fallback)
  if (process.env.POSTGRES_URL) {
    try {
      if (table === 'students') {
        const { rows } = await sql`SELECT * FROM vsa_students ORDER BY updated_at DESC;`;
        return NextResponse.json({ success: true, provider: 'vercel_postgres', data: rows });
      }
      if (table === 'attendance') {
        const { rows } = await sql`SELECT * FROM vsa_attendance ORDER BY created_at DESC LIMIT 500;`;
        return NextResponse.json({ success: true, provider: 'vercel_postgres', data: rows });
      }
    } catch {
      return NextResponse.json({ success: true, provider: 'vercel_postgres', data: [] });
    }
  }

  return NextResponse.json({
    success: true,
    provider: 'local_storage_fallback',
    data: [],
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { students, attendance, table, records } = body;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY;

    // Determine records to upsert
    const studentsToUpsert = students || (table === 'students' ? records : null);
    const attendanceToUpsert = attendance || (table === 'attendance' ? records : null);

    // 1. SUPABASE DATABASE (Primary Choice)
    if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      if (Array.isArray(studentsToUpsert) && studentsToUpsert.length > 0) {
        const cleanedStudents = studentsToUpsert.map((s: any) => ({
          id: String(s.id),
          student_id: String(s.student_id),
          full_name: String(s.full_name),
          photo_url: String(s.photo_url || ''),
          father_name: String(s.father_name || ''),
          mother_name: String(s.mother_name || ''),
          gender: String(s.gender || 'Other'),
          date_of_birth: String(s.date_of_birth || ''),
          mobile: String(s.mobile || ''),
          email: String(s.email || ''),
          address: String(s.address || ''),
          course: String(s.course || ''),
          batch: String(s.batch || ''),
          admission_date: String(s.admission_date || ''),
          course_start_date: String(s.course_start_date || ''),
          course_end_date: String(s.course_end_date || ''),
          emergency_contact: String(s.emergency_contact || ''),
          blood_group: String(s.blood_group || ''),
          status: String(s.status || 'Active'),
          remarks: String(s.remarks || ''),
          qr_code_token: String(s.qr_code_token || ''),
          created_at: s.created_at || new Date().toISOString(),
        }));

        await supabase.from('vsa_students').upsert(cleanedStudents, { onConflict: 'student_id' });
      }

      if (Array.isArray(attendanceToUpsert) && attendanceToUpsert.length > 0) {
        const cleanedAttendance = attendanceToUpsert.map((a: any) => ({
          id: String(a.id),
          student_id: String(a.student_id),
          student_name: String(a.student_name),
          date: String(a.date),
          arrival_time: String(a.arrival_time || ''),
          departure_time: a.departure_time ? String(a.departure_time) : null,
          total_hours: Number(a.total_hours || 0),
          total_minutes: Number(a.total_minutes || 0),
          status: String(a.status || 'Present'),
          recorded_by: String(a.recorded_by || 'QR Scanner'),
          created_at: a.created_at || new Date().toISOString(),
        }));

        await supabase.from('vsa_attendance').upsert(cleanedAttendance, { onConflict: 'id' });
      }

      return NextResponse.json({
        success: true,
        provider: 'supabase',
        syncedStudents: studentsToUpsert?.length || 0,
        syncedAttendance: attendanceToUpsert?.length || 0,
      });
    }

    // 2. VERCEL POSTGRES (Fallback)
    if (process.env.POSTGRES_URL) {
      if (Array.isArray(studentsToUpsert)) {
        for (const s of studentsToUpsert) {
          await sql`
            INSERT INTO vsa_students (
              student_id, full_name, course_name, batch_time, phone, email, enrollment_date, status, qr_token, photo_url
            )
            VALUES (
              ${s.student_id}, ${s.full_name}, ${s.course || ''}, ${s.batch || ''},
              ${s.mobile || ''}, ${s.email || ''}, ${s.admission_date || ''}, ${s.status || 'Active'},
              ${s.qr_code_token || ''}, ${s.photo_url || ''}
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
      }
      return NextResponse.json({ success: true, provider: 'vercel_postgres' });
    }

    return NextResponse.json({ success: true, provider: 'local_storage_ready' });
  } catch (err: unknown) {
    console.error('API /db POST Error:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
