'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { InstituteSettings, Student, AttendanceRecord } from '@/types';
import { calculateDuration, determineAttendanceStatus, formatShortTimeNow, getTodayDateString } from './utils';
import { playSoundEffect } from './audio';
import confetti from 'canvas-confetti';

interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface VectoraContextType {
  instituteSettings: InstituteSettings;
  updateInstituteSettings: (settings: Partial<InstituteSettings>) => void;
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'qr_code_token'>) => Student;
  updateStudent: (id: string, updated: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  attendance: AttendanceRecord[];
  recordQRScan: (qrTokenOrId: string) => {
    success: boolean;
    type: 'checkin' | 'checkout';
    student?: Student;
    record?: AttendanceRecord;
    message: string;
  };
  recordManualAttendance: (
    studentId: string,
    date: string,
    arrivalTime: string,
    departureTime: string | null
  ) => void;
  deleteAttendanceRecord: (id: string) => void;
  toasts: ToastMessage[];
  addToast: (title: string, description: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  themeMode: 'dark' | 'light';
  toggleThemeMode: () => void;
  selectedStudentForCard: Student | null;
  setSelectedStudentForCard: (student: Student | null) => void;
}

const defaultInstituteSettings: InstituteSettings = {
  institute_name: 'Vectora Computer Institute',
  institute_code: 'VCI',
  logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
  address: '402 Innovation Tower, Silicon Avenue',
  city: 'Bangalore',
  state: 'Karnataka',
  pin_code: '560100',
  phone: '+91 98765 43210',
  email: 'info@vectora.edu',
  website: 'https://vectora.edu',
  principal_name: 'Dr. Arvind Sharma',
  authorized_signature_url: 'https://api.iconify.design/lucide:pen-tool.svg?color=%236366f1',
  institute_stamp_url: 'https://api.iconify.design/lucide:shield-check.svg?color=%2306b6d4',
  primary_color: '#4f46e5',
  secondary_color: '#06b6d4',
};

const INITIAL_STUDENTS: Student[] = [
  {
    id: '1',
    student_id: 'VCI-07-26-0001',
    full_name: 'Aarav Mehta',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    father_name: 'Rajesh Mehta',
    mother_name: 'Suman Mehta',
    gender: 'Male',
    date_of_birth: '2004-04-12',
    mobile: '9876511001',
    email: 'aarav.m@vectora.edu',
    address: '12 Green Park Residence, Indiranagar, Bangalore',
    course: 'Full Stack Web Engineering',
    batch: 'Morning Batch (09:00 AM - 01:00 PM)',
    admission_date: '2026-05-15',
    course_start_date: '2026-06-01',
    course_end_date: '2026-12-01',
    emergency_contact: '9876511002',
    blood_group: 'B+',
    status: 'Active',
    remarks: 'Consistent top performer in React and Next.js',
    qr_code_token: 'VCI-TOKEN-0001-AARAV',
  },
  {
    id: '2',
    student_id: 'VCI-07-26-0002',
    full_name: 'Diya Sharma',
    photo_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    father_name: 'Anil Sharma',
    mother_name: 'Pooja Sharma',
    gender: 'Female',
    date_of_birth: '2003-09-23',
    mobile: '9876511003',
    email: 'diya.s@vectora.edu',
    address: '45 Lotus Enclave, Koramangala, Bangalore',
    course: 'AI & Data Science Professional',
    batch: 'Morning Batch (09:00 AM - 01:00 PM)',
    admission_date: '2026-05-18',
    course_start_date: '2026-06-01',
    course_end_date: '2027-01-01',
    emergency_contact: '9876511004',
    blood_group: 'O+',
    status: 'Active',
    remarks: 'Excellent analytical and Python skills',
    qr_code_token: 'VCI-TOKEN-0002-DIYA',
  },
  {
    id: '3',
    student_id: 'VCI-07-26-0003',
    full_name: 'Rohan Verma',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    father_name: 'Suresh Verma',
    mother_name: 'Kavita Verma',
    gender: 'Male',
    date_of_birth: '2004-11-05',
    mobile: '9876511005',
    email: 'rohan.v@vectora.edu',
    address: '88 Tech Boulevard, Whitefield, Bangalore',
    course: 'Cyber Security & Ethical Hacking',
    batch: 'Afternoon Batch (02:00 PM - 06:00 PM)',
    admission_date: '2026-05-20',
    course_start_date: '2026-06-01',
    course_end_date: '2026-11-01',
    emergency_contact: '9876511006',
    blood_group: 'AB+',
    status: 'Active',
    remarks: 'Strong Linux administration background',
    qr_code_token: 'VCI-TOKEN-0003-ROHAN',
  },
  {
    id: '4',
    student_id: 'VCI-07-26-0004',
    full_name: 'Ananya Iyer',
    photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    father_name: 'Krishnan Iyer',
    mother_name: 'Lakshmi Iyer',
    gender: 'Female',
    date_of_birth: '2005-01-14',
    mobile: '9876511007',
    email: 'ananya.i@vectora.edu',
    address: '304 Sapphire Heights, HSR Layout, Bangalore',
    course: 'Cloud Computing & AWS DevOps',
    batch: 'Afternoon Batch (02:00 PM - 06:00 PM)',
    admission_date: '2026-05-22',
    course_start_date: '2026-06-01',
    course_end_date: '2026-12-01',
    emergency_contact: '9876511008',
    blood_group: 'A+',
    status: 'Active',
    remarks: 'AWS Certified Cloud Practitioner',
    qr_code_token: 'VCI-TOKEN-0004-ANANYA',
  },
  {
    id: '5',
    student_id: 'VCI-07-26-0005',
    full_name: 'Kabir Singhania',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    father_name: 'Vikram Singhania',
    mother_name: 'Meera Singhania',
    gender: 'Male',
    date_of_birth: '2003-06-30',
    mobile: '9876511009',
    email: 'kabir.s@vectora.edu',
    address: '19 Royal Crest, Jayanagar, Bangalore',
    course: 'UI/UX & Interactive Product Design',
    batch: 'Evening Batch (06:00 PM - 09:00 PM)',
    admission_date: '2026-05-25',
    course_start_date: '2026-06-01',
    course_end_date: '2026-10-01',
    emergency_contact: '9876511010',
    blood_group: 'O-',
    status: 'Active',
    remarks: 'Figma master with stunning portfolio',
    qr_code_token: 'VCI-TOKEN-0005-KABIR',
  },
  {
    id: '6',
    student_id: 'VCI-07-26-0006',
    full_name: 'Sneha Kulkarni',
    photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    father_name: 'Mahesh Kulkarni',
    mother_name: 'Radha Kulkarni',
    gender: 'Female',
    date_of_birth: '2004-08-19',
    mobile: '9876511011',
    email: 'sneha.k@vectora.edu',
    address: '72 Cedar Villa, Bannerghatta Road, Bangalore',
    course: 'Full Stack Web Engineering',
    batch: 'Morning Batch (09:00 AM - 01:00 PM)',
    admission_date: '2026-05-28',
    course_start_date: '2026-06-01',
    course_end_date: '2026-12-01',
    emergency_contact: '9876511012',
    blood_group: 'B+',
    status: 'Active',
    remarks: 'Enthusiastic front-end developer',
    qr_code_token: 'VCI-TOKEN-0006-SNEHA',
  },
  {
    id: '7',
    student_id: 'VCI-07-26-0007',
    full_name: 'Pranav Nair',
    photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    father_name: 'Gopal Nair',
    mother_name: 'Shanti Nair',
    gender: 'Male',
    date_of_birth: '2003-12-10',
    mobile: '9876511013',
    email: 'pranav.n@vectora.edu',
    address: '210 Palm Grove, MG Road, Bangalore',
    course: 'AI & Data Science Professional',
    batch: 'Evening Batch (06:00 PM - 09:00 PM)',
    admission_date: '2026-06-02',
    course_start_date: '2026-06-05',
    course_end_date: '2027-01-05',
    emergency_contact: '9876511014',
    blood_group: 'A-',
    status: 'Active',
    remarks: 'Focusing on PyTorch and Deep Learning',
    qr_code_token: 'VCI-TOKEN-0007-PRANAV',
  },
  {
    id: '8',
    student_id: 'VCI-07-26-0008',
    full_name: 'Ishita Patel',
    photo_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    father_name: 'Dinesh Patel',
    mother_name: 'Rupa Patel',
    gender: 'Female',
    date_of_birth: '2005-03-22',
    mobile: '9876511015',
    email: 'ishita.p@vectora.edu',
    address: '155 Horizon Tower, Electronic City, Bangalore',
    course: 'Cyber Security & Ethical Hacking',
    batch: 'Morning Batch (09:00 AM - 01:00 PM)',
    admission_date: '2026-06-03',
    course_start_date: '2026-06-05',
    course_end_date: '2026-11-05',
    emergency_contact: '9876511016',
    blood_group: 'O+',
    status: 'Active',
    remarks: 'CTF competition winner',
    qr_code_token: 'VCI-TOKEN-0008-ISHITA',
  },
];

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  // Today's Check-ins
  {
    id: 'att-today-1',
    student_id: 'VCI-07-26-0001',
    student_name: 'Aarav Mehta',
    date: getTodayDateString(),
    arrival_time: '09:05 AM',
    departure_time: '01:15 PM',
    total_hours: 4.17,
    total_minutes: 250,
    status: 'Present',
    recorded_by: 'QR Scanner',
  },
  {
    id: 'att-today-2',
    student_id: 'VCI-07-26-0002',
    student_name: 'Diya Sharma',
    date: getTodayDateString(),
    arrival_time: '08:58 AM',
    departure_time: '01:10 PM',
    total_hours: 4.2,
    total_minutes: 252,
    status: 'Present',
    recorded_by: 'QR Scanner',
  },
  {
    id: 'att-today-3',
    student_id: 'VCI-07-26-0006',
    student_name: 'Sneha Kulkarni',
    date: getTodayDateString(),
    arrival_time: '09:40 AM',
    departure_time: '01:15 PM',
    total_hours: 3.58,
    total_minutes: 215,
    status: 'Late Entry',
    recorded_by: 'QR Scanner',
  },
  {
    id: 'att-today-4',
    student_id: 'VCI-07-26-0008',
    student_name: 'Ishita Patel',
    date: getTodayDateString(),
    arrival_time: '09:02 AM',
    departure_time: null,
    total_hours: 0,
    total_minutes: 0,
    status: 'Present',
    recorded_by: 'QR Scanner',
  },
  // Yesterday records for analytics
  {
    id: 'att-yest-1',
    student_id: 'VCI-07-26-0001',
    student_name: 'Aarav Mehta',
    date: '2026-07-09',
    arrival_time: '09:01 AM',
    departure_time: '01:10 PM',
    total_hours: 4.15,
    total_minutes: 249,
    status: 'Present',
    recorded_by: 'QR Scanner',
  },
  {
    id: 'att-yest-2',
    student_id: 'VCI-07-26-0002',
    student_name: 'Diya Sharma',
    date: '2026-07-09',
    arrival_time: '08:55 AM',
    departure_time: '01:05 PM',
    total_hours: 4.17,
    total_minutes: 250,
    status: 'Present',
    recorded_by: 'QR Scanner',
  },
  {
    id: 'att-yest-3',
    student_id: 'VCI-07-26-0003',
    student_name: 'Rohan Verma',
    date: '2026-07-09',
    arrival_time: '02:05 PM',
    departure_time: '06:05 PM',
    total_hours: 4.0,
    total_minutes: 240,
    status: 'Present',
    recorded_by: 'QR Scanner',
  },
  {
    id: 'att-yest-4',
    student_id: 'VCI-07-26-0004',
    student_name: 'Ananya Iyer',
    date: '2026-07-09',
    arrival_time: '02:40 PM',
    departure_time: '06:00 PM',
    total_hours: 3.33,
    total_minutes: 200,
    status: 'Late Entry',
    recorded_by: 'QR Scanner',
  },
  {
    id: 'att-yest-5',
    student_id: 'VCI-07-26-0005',
    student_name: 'Kabir Singhania',
    date: '2026-07-09',
    arrival_time: '06:00 PM',
    departure_time: '09:05 PM',
    total_hours: 3.08,
    total_minutes: 185,
    status: 'Present',
    recorded_by: 'QR Scanner',
  },
];

const VectoraContext = createContext<VectoraContextType | undefined>(undefined);

export const VectoraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [instituteSettings, setInstituteSettings] = useState<InstituteSettings>(defaultInstituteSettings);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [selectedStudentForCard, setSelectedStudentForCard] = useState<Student | null>(null);

  useEffect(() => {
    // Load persisted state from localStorage first for instant display
    try {
      const savedSettings = localStorage.getItem('vsa_settings');
      if (savedSettings) setInstituteSettings(JSON.parse(savedSettings));

      const savedStudents = localStorage.getItem('vsa_students');
      if (savedStudents) setStudents(JSON.parse(savedStudents));

      const savedAttendance = localStorage.getItem('vsa_attendance');
      if (savedAttendance) setAttendance(JSON.parse(savedAttendance));

      const savedTheme = localStorage.getItem('vsa_theme') as 'dark' | 'light' | null;
      if (savedTheme) {
        setThemeMode(savedTheme);
      }
    } catch {
      // Ignore storage read errors
    }

    // Automatically sync & fetch latest live data from Vercel Cloud Database (/api/db)
    const fetchCloudData = async () => {
      try {
        const [studRes, attRes] = await Promise.all([
          fetch('/api/db?table=students'),
          fetch('/api/db?table=attendance'),
        ]);
        if (studRes.ok) {
          const studJson = await studRes.json();
          if (Array.isArray(studJson.data) && studJson.data.length > 0) {
            setStudents(studJson.data);
            localStorage.setItem('vsa_students', JSON.stringify(studJson.data));
          }
        }
        if (attRes.ok) {
          const attJson = await attRes.json();
          if (Array.isArray(attJson.data) && attJson.data.length > 0) {
            setAttendance(attJson.data);
            localStorage.setItem('vsa_attendance', JSON.stringify(attJson.data));
          }
        }
      } catch {
        // Silently fall back to local storage if offline or database not yet configured
      }
    };
    fetchCloudData();
  }, []);

  // Background cloud database push helper
  const syncToVercelCloud = async (studentsList: Student[], attendanceList: AttendanceRecord[]) => {
    try {
      await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          students: studentsList,
          attendance: attendanceList,
        }),
      });
    } catch {
      // Silently retry later if network delay
    }
  };

  useEffect(() => {
    // Sync theme to document body and root variables
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('vsa_theme', themeMode);
  }, [themeMode]);

  const addToast = (title: string, description: string, type: ToastMessage['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateInstituteSettings = (updated: Partial<InstituteSettings>) => {
    setInstituteSettings((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem('vsa_settings', JSON.stringify(next));
      return next;
    });
    addToast('Institute Settings Saved', 'Your institute configuration and themes have been updated.', 'success');
  };

  const addStudent = (newStudentData: Omit<Student, 'id' | 'qr_code_token'>): Student => {
    const id = Math.random().toString(36).substring(2, 11);
    const qr_code_token = `VCI-TOKEN-${newStudentData.student_id}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const student: Student = {
      ...newStudentData,
      id,
      qr_code_token,
      created_at: new Date().toISOString(),
    };

    setStudents((prev) => {
      const next = [student, ...prev];
      localStorage.setItem('vsa_students', JSON.stringify(next));
      syncToVercelCloud(next, attendance);
      return next;
    });

    addToast('Student Registered Successfully', `${student.full_name} (${student.student_id}) has been added & Smart ID generated.`, 'success');

    // Trigger confetti celebration
    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch {
      // Ignore confetti issues
    }

    return student;
  };

  const updateStudent = (id: string, updated: Partial<Student>) => {
    setStudents((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...updated } : s));
      localStorage.setItem('vsa_students', JSON.stringify(next));
      syncToVercelCloud(next, attendance);
      return next;
    });
    addToast('Student Updated', 'Student profile details have been saved successfully.', 'info');
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => {
      const next = prev.filter((s) => s.id !== id);
      localStorage.setItem('vsa_students', JSON.stringify(next));
      syncToVercelCloud(next, attendance);
      return next;
    });
    addToast('Student Removed', 'Student and related records have been deleted.', 'warning');
  };

  const recordQRScan = (qrTokenOrId: string) => {
    const today = getTodayDateString();
    const nowTime = formatShortTimeNow();

    // Match student either by QR token, student_id, or full name match
    const cleanQuery = qrTokenOrId.trim();
    const student = students.find(
      (s) =>
        s.qr_code_token.toLowerCase() === cleanQuery.toLowerCase() ||
        s.student_id.toLowerCase() === cleanQuery.toLowerCase() ||
        s.id === cleanQuery
    );

    if (!student) {
      playSoundEffect('error');
      addToast('Scan Failed', `No student found for token "${cleanQuery}"`, 'error');
      return {
        success: false,
        type: 'checkin' as const,
        message: 'Student not found in active records.',
      };
    }

    // Check if attendance already exists today
    const existingIndex = attendance.findIndex(
      (a) => a.student_id === student.student_id && a.date === today
    );

    if (existingIndex === -1) {
      // FIRST SCAN -> Check-in / Arrival Time
      const status = determineAttendanceStatus(nowTime, null, 0);
      const newRecord: AttendanceRecord = {
        id: `att-${Date.now()}`,
        student_id: student.student_id,
        student_name: student.full_name,
        date: today,
        arrival_time: nowTime,
        departure_time: null,
        total_hours: 0,
        total_minutes: 0,
        status,
        recorded_by: 'QR Scanner',
        created_at: new Date().toISOString(),
      };

      const updatedList = [newRecord, ...attendance];
      setAttendance(updatedList);
      localStorage.setItem('vsa_attendance', JSON.stringify(updatedList));
      syncToVercelCloud(students, updatedList);

      playSoundEffect('success');
      try {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.65 } });
      } catch {
        // Ignore confetti errors
      }

      const msg = `Check-In recorded at ${nowTime} (${status})`;
      addToast('QR Attendance Recorded!', `${student.full_name} (${student.student_id}) - ${msg}`, 'success');

      return {
        success: true,
        type: 'checkin' as const,
        student,
        record: newRecord,
        message: msg,
      };
    } else {
      // SECOND SCAN -> Check-out / Departure Time
      const currentRec = attendance[existingIndex];
      const { totalHours, totalMinutes } = calculateDuration(currentRec.arrival_time, nowTime);

      // Enforce minimum 5-minute gap between arrival check-in and checkout scan
      if (totalMinutes < 5) {
        playSoundEffect('error');
        const waitMsg = `Already Checked In at ${currentRec.arrival_time}. Please wait at least 5 minutes before recording Check-Out.`;
        addToast('Check-Out Locked (Wait 5 mins)', `${student.full_name} - ${waitMsg}`, 'warning');
        return {
          success: false,
          type: 'checkin' as const,
          student,
          record: currentRec,
          message: waitMsg,
        };
      }

      const updatedStatus = determineAttendanceStatus(currentRec.arrival_time, nowTime, totalHours);

      const updatedRecord: AttendanceRecord = {
        ...currentRec,
        departure_time: nowTime,
        total_hours: totalHours,
        total_minutes: totalMinutes,
        status: updatedStatus,
      };

      const nextList = [...attendance];
      nextList[existingIndex] = updatedRecord;
      setAttendance(nextList);
      localStorage.setItem('vsa_attendance', JSON.stringify(nextList));
      syncToVercelCloud(students, nextList);

      playSoundEffect('checkout');

      const msg = `Check-Out at ${nowTime} | Total: ${totalHours} hrs (${updatedStatus})`;
      addToast('Check-Out Recorded!', `${student.full_name} - ${msg}`, 'success');

      return {
        success: true,
        type: 'checkout' as const,
        student,
        record: updatedRecord,
        message: msg,
      };
    }
  };

  const recordManualAttendance = (
    studentId: string,
    date: string,
    arrivalTime: string,
    departureTime: string | null
  ) => {
    const student = students.find((s) => s.student_id === studentId || s.id === studentId);
    if (!student) {
      addToast('Error', 'Student not found', 'error');
      return;
    }

    const { totalHours, totalMinutes } = calculateDuration(arrivalTime, departureTime);
    const status = determineAttendanceStatus(arrivalTime, departureTime, totalHours);

    const existingIdx = attendance.findIndex((a) => a.student_id === student.student_id && a.date === date);

    if (existingIdx !== -1) {
      const updated = {
        ...attendance[existingIdx],
        arrival_time: arrivalTime,
        departure_time: departureTime,
        total_hours: totalHours,
        total_minutes: totalMinutes,
        status,
        recorded_by: 'Manual Admin',
      };
      const nextList = [...attendance];
      nextList[existingIdx] = updated;
      setAttendance(nextList);
      localStorage.setItem('vsa_attendance', JSON.stringify(nextList));
      syncToVercelCloud(students, nextList);
      addToast('Attendance Updated', `Manual attendance saved for ${student.full_name}`, 'success');
    } else {
      const newRec: AttendanceRecord = {
        id: `att-manual-${Date.now()}`,
        student_id: student.student_id,
        student_name: student.full_name,
        date,
        arrival_time: arrivalTime,
        departure_time: departureTime,
        total_hours: totalHours,
        total_minutes: totalMinutes,
        status,
        recorded_by: 'Manual Admin',
      };
      const nextList = [newRec, ...attendance];
      setAttendance(nextList);
      localStorage.setItem('vsa_attendance', JSON.stringify(nextList));
      syncToVercelCloud(students, nextList);
      addToast('Manual Attendance Recorded', `Saved for ${student.full_name} (${student.student_id})`, 'success');
    }
    playSoundEffect('bell');
  };

  const deleteAttendanceRecord = (id: string) => {
    setAttendance((prev) => {
      const next = prev.filter((a) => a.id !== id);
      localStorage.setItem('vsa_attendance', JSON.stringify(next));
      syncToVercelCloud(students, next);
      return next;
    });
    addToast('Attendance Record Deleted', 'Entry has been removed from log.', 'info');
  };

  const toggleThemeMode = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <VectoraContext.Provider
      value={{
        instituteSettings,
        updateInstituteSettings,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        attendance,
        recordQRScan,
        recordManualAttendance,
        deleteAttendanceRecord,
        toasts,
        addToast,
        removeToast,
        themeMode,
        toggleThemeMode,
        selectedStudentForCard,
        setSelectedStudentForCard,
      }}
    >
      {children}
    </VectoraContext.Provider>
  );
};

export const useVectora = () => {
  const context = useContext(VectoraContext);
  if (!context) {
    throw new Error('useVectora must be used within a VectoraProvider');
  }
  return context;
};
