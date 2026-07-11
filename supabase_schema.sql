-- ==============================================================================
-- VECTORA SMART ATTENDANCE (VSA) - OFFICIAL SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard -> SQL Editor -> New Query.
-- 2. Paste this entire SQL command block and click "Run".
-- ==============================================================================

-- 1. CREATE STUDENTS TABLE (vsa_students)
CREATE TABLE IF NOT EXISTS public.vsa_students (
  id TEXT NOT NULL,
  student_id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  photo_url TEXT,
  father_name TEXT,
  mother_name TEXT,
  gender TEXT DEFAULT 'Other',
  date_of_birth TEXT,
  mobile TEXT,
  email TEXT,
  address TEXT,
  course TEXT,
  batch TEXT,
  admission_date TEXT,
  course_start_date TEXT,
  course_end_date TEXT,
  emergency_contact TEXT,
  blood_group TEXT,
  status TEXT DEFAULT 'Active',
  remarks TEXT,
  qr_code_token TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CREATE ATTENDANCE TABLE (vsa_attendance)
CREATE TABLE IF NOT EXISTS public.vsa_attendance (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES public.vsa_students(student_id) ON DELETE CASCADE,
  student_name TEXT,
  date TEXT NOT NULL,
  arrival_time TEXT,
  departure_time TEXT,
  total_hours NUMERIC DEFAULT 0,
  total_minutes INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Present',
  recorded_by TEXT DEFAULT 'QR Scanner',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CREATE PERFORMANCE INDEXES FOR FAST ANALYTICS
CREATE INDEX IF NOT EXISTS idx_vsa_students_status ON public.vsa_students(status);
CREATE INDEX IF NOT EXISTS idx_vsa_attendance_student_id ON public.vsa_attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_vsa_attendance_date ON public.vsa_attendance(date);

-- 4. ENABLE ROW LEVEL SECURITY (RLS) WITH SERVICE/ANON PERMISSIONS
ALTER TABLE public.vsa_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vsa_attendance ENABLE ROW LEVEL SECURITY;

-- Allow full read/write access for authenticating Vercel / Next.js backend requests
CREATE POLICY "Allow Full Access on vsa_students" 
ON public.vsa_students 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow Full Access on vsa_attendance" 
ON public.vsa_attendance 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- ==============================================================================
-- DONE! Your Supabase database is now 100% configured for Vectora Smart Attendance.
-- ==============================================================================
