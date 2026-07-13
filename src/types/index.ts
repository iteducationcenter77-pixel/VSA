export interface InstituteSettings {
  institute_name: string;
  institute_code: string;
  logo_url: string;
  address: string;
  city: string;
  state: string;
  pin_code: string;
  phone: string;
  email: string;
  website: string;
  principal_name: string;
  authorized_signature_url: string;
  institute_stamp_url: string;
  official_seal_url?: string;
  primary_color: string;
  secondary_color: string;
  admin_username?: string;
  admin_password?: string;
}

export interface Student {
  id: string;
  student_id: string; // e.g. VCI-07-26-0001
  full_name: string;
  photo_url: string;
  father_name: string;
  mother_name: string;
  gender: 'Male' | 'Female' | 'Other';
  date_of_birth: string;
  mobile: string;
  email: string;
  address: string;
  course: string;
  batch: string;
  admission_date: string;
  course_start_date: string;
  course_end_date: string;
  emergency_contact: string;
  blood_group?: string;
  status: 'Active' | 'Inactive' | 'Completed';
  remarks?: string;
  qr_code_token: string;
  created_at?: string;
}

export type AttendanceStatusType = 'Present' | 'Late Entry' | 'Early Exit' | 'Half Day' | 'Absent';

export interface AttendanceRecord {
  id: string;
  student_id: string;
  student_name: string;
  date: string; // YYYY-MM-DD
  arrival_time: string | null; // HH:mm:ss or HH:mm AM/PM
  departure_time: string | null;
  total_hours: number;
  total_minutes: number;
  status: AttendanceStatusType;
  recorded_by: string;
  created_at?: string;
}

export interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  role: 'Administrator' | 'Teacher' | 'Staff';
  status: 'Active' | 'Inactive';
}

export interface QRTokenPayload {
  student_id: string;
  student_name: string;
  course: string;
  institute_code: string;
  token: string;
}

export interface ReportFilter {
  fromDate: string;
  toDate: string;
  course: string;
  batch: string;
  studentQuery: string;
  status: string;
}
