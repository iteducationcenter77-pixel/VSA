import { AttendanceStatusType, Student } from '@/types';

export function generateNextStudentID(existingStudents: Student[], instituteCode: string = 'VCI'): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);

  // Find max auto increment number for this month/year or globally
  let maxSeq = 0;
  for (const s of existingStudents) {
    const parts = s.student_id.split('-');
    if (parts.length === 4) {
      const num = parseInt(parts[3], 10);
      if (!isNaN(num) && num > maxSeq) {
        maxSeq = num;
      }
    }
  }

  const nextSeq = String(maxSeq + 1).padStart(4, '0');
  return `${instituteCode.toUpperCase()}-${month}-${year}-${nextSeq}`;
}

export function generateQRToken(studentId: string): string {
  const rand = Math.random().toString(36).substring(2, 10);
  return `VCI-TOKEN-${studentId}-${rand}`;
}

export function calculateDuration(arrivalTime: string | null, departureTime: string | null): { totalHours: number; totalMinutes: number } {
  if (!arrivalTime || !departureTime) {
    return { totalHours: 0, totalMinutes: 0 };
  }

  const parseToMinutes = (timeStr: string): number => {
    // Check if time is HH:MM or HH:MM AM/PM
    const clean = timeStr.trim();
    const ampmMatch = clean.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (ampmMatch) {
      let hours = parseInt(ampmMatch[1], 10);
      const mins = parseInt(ampmMatch[2], 10);
      const ampm = ampmMatch[3].toUpperCase();
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      return hours * 60 + mins;
    }
    const parts = clean.split(':');
    if (parts.length >= 2) {
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
    return 0;
  };

  const arrMins = parseToMinutes(arrivalTime);
  const depMins = parseToMinutes(departureTime);

  if (depMins <= arrMins) {
    return { totalHours: 0, totalMinutes: 0 };
  }

  const diff = depMins - arrMins;
  const totalHours = Number((diff / 60).toFixed(2));
  return { totalHours, totalMinutes: diff };
}

export function determineAttendanceStatus(arrivalTime: string | null, departureTime: string | null, totalHours: number): AttendanceStatusType {
  if (!arrivalTime) return 'Absent';

  // Parse arrival hour
  const ampmMatch = arrivalTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
  let arrHour = 9;
  let arrMin = 0;
  if (ampmMatch) {
    arrHour = parseInt(ampmMatch[1], 10);
    arrMin = parseInt(ampmMatch[2], 10);
    if (ampmMatch[3].toUpperCase() === 'PM' && arrHour < 12) arrHour += 12;
    if (ampmMatch[3].toUpperCase() === 'AM' && arrHour === 12) arrHour = 0;
  } else {
    const parts = arrivalTime.split(':');
    if (parts.length >= 2) {
      arrHour = parseInt(parts[0], 10);
      arrMin = parseInt(parts[1], 10);
    }
  }

  const arrivalMinutesOfDay = arrHour * 60 + arrMin;

  if (departureTime && totalHours > 0) {
    if (totalHours < 2.5) return 'Half Day';
    if (totalHours < 4) return 'Early Exit';
  }

  // Late entry threshold: after 9:30 AM (570 mins)
  if (arrivalMinutesOfDay > 570) {
    return 'Late Entry';
  }

  return 'Present';
}

export function formatTimeNow(): string {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
}

export function formatShortTimeNow(): string {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function downloadCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const escapeCsv = (val: string | number) => {
    const s = String(val ?? '');
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const content = [
    headers.map(escapeCsv).join(','),
    ...rows.map((row) => row.map(escapeCsv).join(',')),
  ].join('\n');

  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Converts Google Drive shareable URLs into direct viewable image URLs
 * e.g., drive.google.com/file/d/FILE_ID/view -> lh3.googleusercontent.com/d/FILE_ID
 */
export function formatImageUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  const driveRegex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|lh3\.googleusercontent\.com\/d\/)([a-zA-Z0-9_-]{25,})/;
  const match = trimmed.match(driveRegex);
  if (match && match[1]) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  return trimmed;
}
