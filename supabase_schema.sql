-- ==============================================================================
-- VECTORA SMART ATTENDANCE - SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- Execute this script in your Supabase SQL Editor to set up tables, RLS policies,
-- indexes, and initial seed data for Vectora Smart Attendance.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. INSTITUTE SETTINGS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS institute_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_name TEXT NOT NULL DEFAULT 'Vectora Computer Institute',
    institute_code TEXT NOT NULL DEFAULT 'VCI',
    logo_url TEXT DEFAULT '',
    address TEXT DEFAULT '402 Innovation Tower, Tech Park',
    city TEXT DEFAULT 'Bangalore',
    state TEXT DEFAULT 'Karnataka',
    pin_code TEXT DEFAULT '560100',
    phone TEXT DEFAULT '+91 98765 43210',
    email TEXT DEFAULT 'info@vectora.edu',
    website TEXT DEFAULT 'https://vectora.edu',
    principal_name TEXT DEFAULT 'Dr. Arvind Sharma',
    authorized_signature_url TEXT DEFAULT '',
    institute_stamp_url TEXT DEFAULT '',
    primary_color TEXT DEFAULT '#4f46e5',
    secondary_color TEXT DEFAULT '#06b6d4',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ==============================================================================
-- 2. USERS (ADMIN & TEACHERS) TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Administrator',
    status TEXT DEFAULT 'Active',
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ==============================================================================
-- 3. STUDENTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    photo_url TEXT DEFAULT '',
    father_name TEXT DEFAULT '',
    mother_name TEXT DEFAULT '',
    gender TEXT DEFAULT 'Male',
    date_of_birth DATE,
    mobile TEXT NOT NULL,
    email TEXT DEFAULT '',
    address TEXT DEFAULT '',
    course TEXT NOT NULL,
    batch TEXT NOT NULL,
    admission_date DATE DEFAULT CURRENT_DATE,
    course_start_date DATE DEFAULT CURRENT_DATE,
    course_end_date DATE,
    emergency_contact TEXT DEFAULT '',
    blood_group TEXT DEFAULT '',
    status TEXT DEFAULT 'Active',
    remarks TEXT DEFAULT '',
    qr_code_token TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ==============================================================================
-- 4. ATTENDANCE TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    arrival_time TIME,
    departure_time TIME,
    total_hours NUMERIC(5,2) DEFAULT 0,
    total_minutes INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Present', -- Present, Late Entry, Early Exit, Half Day, Absent
    recorded_by TEXT DEFAULT 'QR Scanner',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    UNIQUE(student_id, date)
);

-- ==============================================================================
-- INDEXES FOR FAST PERFORMANCE & ANALYTICS
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_course ON students(course);
CREATE INDEX IF NOT EXISTS idx_students_batch ON students(batch);
CREATE INDEX IF NOT EXISTS idx_students_qr_token ON students(qr_code_token);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(status);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE institute_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Allow public read/write access for easy testing and API integration
CREATE POLICY "Allow public access to institute_settings" ON institute_settings FOR ALL USING (true);
CREATE POLICY "Allow public access to admin_users" ON admin_users FOR ALL USING (true);
CREATE POLICY "Allow public access to students" ON students FOR ALL USING (true);
CREATE POLICY "Allow public access to attendance" ON attendance FOR ALL USING (true);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================
INSERT INTO institute_settings (
    institute_name,
    institute_code,
    city,
    state,
    phone,
    email,
    website,
    principal_name,
    primary_color,
    secondary_color
) VALUES (
    'Vectora Computer Institute',
    'VCI',
    'Bangalore',
    'Karnataka',
    '+91 98765 43210',
    'info@vectora.edu',
    'https://vectora.edu',
    'Dr. Arvind Sharma',
    '#4f46e5',
    '#06b6d4'
) ON CONFLICT DO NOTHING;

INSERT INTO admin_users (full_name, email, password_hash, role)
VALUES ('System Administrator', 'admin@vectora.edu', 'vectora2026', 'Administrator')
ON CONFLICT DO NOTHING;
