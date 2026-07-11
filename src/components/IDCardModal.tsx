'use client';

import React, { useState, useRef } from 'react';
import { Student } from '@/types';
import { useVectora } from '@/lib/store';
import { formatImageUrl } from '@/lib/utils';
import { QRCodeCanvas } from 'qrcode.react';
import {
  X,
  Printer,
  Download,
  FlipHorizontal2,
  Maximize2,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Calendar,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface IDCardModalProps {
  student?: Student | null;
  studentId?: string | null;
  onClose: () => void;
}

export const IDCardModal: React.FC<IDCardModalProps> = ({ student: studentProp, studentId, onClose }) => {
  const { instituteSettings, addToast, students } = useVectora();
  const student = studentProp || (studentId ? students.find((s) => s.id === studentId || s.student_id === studentId) || null : null);
  const [side, setSide] = useState<'front' | 'back'>('front');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const cardRef = useRef<HTMLDivElement>(null);

  if (!student) return null;

  const handlePrint = () => {
    window.print();
    addToast('Printing ID Card', `Sending ${student.full_name}'s ID card to printer.`, 'info');
  };

  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: orientation === 'portrait' ? 'portrait' : 'landscape',
        unit: 'mm',
        format: orientation === 'portrait' ? [54, 86] : [86, 54],
      });
      if (orientation === 'portrait') {
        pdf.addImage(imgData, 'PNG', 0, 0, 54, 86);
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, 86, 54);
      }
      pdf.save(`${student.student_id}_ID_CARD.pdf`);
      addToast('ID Card Downloaded', `PDF file saved for ${student.full_name}`, 'success');
    } catch {
      addToast('Download Error', 'Could not render PDF. Please use Print button.', 'error');
    }
  };

  const issueDate = student.admission_date || new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span>Smart Student ID Card Generator</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Professional identity card for {student.full_name} ({student.student_id})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3 bg-slate-100/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-sm">
          {/* Side & Orientation Switches */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSide(side === 'front' ? 'back' : 'front')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
            >
              <FlipHorizontal2 className="w-4 h-4 text-indigo-500" />
              <span>Side: {side === 'front' ? 'Front Side' : 'Back Side'}</span>
            </button>

            <button
              onClick={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Maximize2 className="w-4 h-4 text-cyan-500" />
              <span>Format: {orientation === 'portrait' ? 'Portrait Card' : 'Landscape Card'}</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-md shadow-indigo-600/30"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Card</span>
            </button>
          </div>
        </div>

        {/* Card Stage / Preview Area */}
        <div className="p-8 flex items-center justify-center bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-auto min-h-[440px]">
          {/* Card Container */}
          <div
            ref={cardRef}
            style={{
              borderColor: instituteSettings.primary_color,
            }}
            className={`relative overflow-hidden rounded-2xl shadow-2xl bg-white border-2 select-none print:shadow-none transition-all ${
              orientation === 'portrait'
                ? 'w-[320px] h-[510px]'
                : 'w-[510px] h-[320px]'
            }`}
          >
            {/* Background Decorative Accent */}
            <div
              style={{ backgroundColor: instituteSettings.primary_color }}
              className="absolute -top-16 -right-16 w-44 h-44 rounded-full opacity-10 pointer-events-none"
            />
            <div
              style={{ backgroundColor: instituteSettings.secondary_color }}
              className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full opacity-10 pointer-events-none"
            />

            {/* PORTRAIT FRONT SIDE */}
            {orientation === 'portrait' && side === 'front' && (
              <div className="flex flex-col h-full justify-between p-5 text-slate-800">
                {/* Header Banner */}
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div
                    style={{ backgroundColor: instituteSettings.primary_color }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0 overflow-hidden"
                  >
                    {instituteSettings.logo_url ? (
                      <img
                        src={formatImageUrl(instituteSettings.logo_url)}
                        alt="logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      instituteSettings.institute_code
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black uppercase tracking-tight text-slate-900 truncate">
                      {instituteSettings.institute_name}
                    </h4>
                    <p className="text-[9px] text-slate-500 truncate">{instituteSettings.address}</p>
                  </div>
                </div>

                {/* Photo & Identity Badge */}
                <div className="flex flex-col items-center text-center my-1">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-indigo-500 shadow-md">
                    <img
                      src={formatImageUrl(student.photo_url) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                      alt={student.full_name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="mt-2 text-base font-extrabold text-slate-900 tracking-tight">
                    {student.full_name}
                  </h3>
                  <div
                    style={{ backgroundColor: instituteSettings.primary_color }}
                    className="mt-0.5 px-3 py-0.5 rounded-full text-[11px] font-mono font-bold text-white shadow-sm"
                  >
                    {student.student_id}
                  </div>
                </div>

                {/* Course & Details Grid */}
                <div className="space-y-1.5 px-2 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Course:</span>
                    <span className="font-bold text-slate-900 text-right truncate max-w-[170px]">{student.course}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Batch:</span>
                    <span className="font-semibold text-slate-800 text-right truncate max-w-[170px]">{student.batch}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Issued:</span>
                    <span className="font-semibold text-slate-800">{issueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Valid Until:</span>
                    <span className="font-bold text-indigo-600">{student.course_end_date || '2027-01-01'}</span>
                  </div>
                </div>

                {/* QR Code & Authorized Signature + Seal Stamp Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <QRCodeCanvas value={student.qr_code_token} size={54} />
                  </div>

                  <div className="relative flex flex-col items-end text-right">
                    {/* Official Stamp/Seal overlay */}
                    {(instituteSettings.official_seal_url || instituteSettings.institute_stamp_url) && (
                      <img
                        src={formatImageUrl(instituteSettings.official_seal_url || instituteSettings.institute_stamp_url)}
                        alt="Official Seal"
                        className="absolute -top-3 right-4 w-12 h-12 object-contain opacity-80 pointer-events-none"
                      />
                    )}
                    <div className="w-24 h-8 flex items-center justify-end overflow-hidden relative z-10">
                      {instituteSettings.authorized_signature_url ? (
                        <img
                          src={formatImageUrl(instituteSettings.authorized_signature_url)}
                          alt="Signature"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <span className="font-serif italic text-xs text-slate-700">Principal</span>
                      )}
                    </div>
                    <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 relative z-10">
                      Authorized Signature
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* PORTRAIT BACK SIDE */}
            {orientation === 'portrait' && side === 'back' && (
              <div className="flex flex-col h-full justify-between p-5 text-slate-800">
                <div className="text-center pb-3 border-b border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Terms & Instructions
                  </h4>
                  <p className="text-[9px] text-slate-500">Must be carried inside institute premises</p>
                </div>

                <div className="space-y-2 text-[10px] text-slate-600 px-1 leading-relaxed">
                  <p>1. This Smart ID Card is non-transferable and remains the property of {instituteSettings.institute_name}.</p>
                  <p>2. Scan the QR code at the entrance kiosk for daily Check-In and Check-Out attendance tracking.</p>
                  <p>3. If found, please return this card to the address mentioned below.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-[10px]">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{student.mobile} (Emergency)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="truncate">{student.email || instituteSettings.email}</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{instituteSettings.address}, {instituteSettings.city}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="text-[9px] text-slate-400">
                    Token: {student.qr_code_token.slice(0, 15)}...
                  </div>
                  <div className="text-[9px] font-bold text-indigo-600 uppercase">
                    {instituteSettings.institute_code} Smart Card
                  </div>
                </div>
              </div>
            )}

            {/* LANDSCAPE FRONT SIDE */}
            {orientation === 'landscape' && side === 'front' && (
              <div className="flex flex-col h-full justify-between p-5 text-slate-800">
                {/* Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div
                      style={{ backgroundColor: instituteSettings.primary_color }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs"
                    >
                      {instituteSettings.institute_code}
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-tight text-slate-900">
                        {instituteSettings.institute_name}
                      </h4>
                      <p className="text-[9px] text-slate-500">{instituteSettings.address}</p>
                    </div>
                  </div>
                  <div
                    style={{ backgroundColor: instituteSettings.primary_color }}
                    className="px-3 py-1 rounded-full text-white font-mono font-bold text-xs"
                  >
                    {student.student_id}
                  </div>
                </div>

                {/* Body Content: Left Photo, Right Details */}
                <div className="grid grid-cols-12 gap-4 items-center py-1">
                  <div className="col-span-4 flex flex-col items-center">
                    <div className="w-24 h-28 rounded-xl overflow-hidden border-2 border-indigo-500 shadow-md">
                      <img
                        src={student.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                        alt={student.full_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="col-span-8 space-y-1.5 text-[11px]">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                        {student.full_name}
                      </h3>
                      <p className="text-[10px] text-indigo-600 font-semibold">{student.course}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] pt-1">
                      <div>
                        <span className="text-slate-400">Batch: </span>
                        <span className="font-semibold text-slate-700">{student.batch}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Phone: </span>
                        <span className="font-semibold text-slate-700">{student.mobile}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Issued: </span>
                        <span className="font-semibold text-slate-700">{issueDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Valid Till: </span>
                        <span className="font-bold text-emerald-600">{student.course_end_date || '2027-01-01'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer QR & Signature */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-white rounded border border-slate-200">
                      <QRCodeCanvas value={student.qr_code_token} size={42} />
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono">Scan for Attendance</span>
                  </div>

                  <div className="relative text-right">
                    {(instituteSettings.official_seal_url || instituteSettings.institute_stamp_url) && (
                      <img
                        src={formatImageUrl(instituteSettings.official_seal_url || instituteSettings.institute_stamp_url)}
                        alt="Official Seal"
                        className="absolute -top-3 right-4 w-11 h-11 object-contain opacity-80 pointer-events-none"
                      />
                    )}
                    <div className="h-6 flex items-center justify-end relative z-10">
                      {instituteSettings.authorized_signature_url && (
                        <img
                          src={formatImageUrl(instituteSettings.authorized_signature_url)}
                          alt="Signature"
                          className="max-h-full object-contain"
                        />
                      )}
                    </div>
                    <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 relative z-10">
                      Authorized Signature
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* LANDSCAPE BACK SIDE */}
            {orientation === 'landscape' && side === 'back' && (
              <div className="flex flex-col h-full justify-between p-5 text-slate-800">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-bold uppercase text-slate-900">
                    Smart Attendance Management Policy
                  </h4>
                  <span className="text-[9px] font-mono text-indigo-600">{student.student_id}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-[10px] text-slate-600">
                  <div className="space-y-1.5 leading-relaxed">
                    <p>• Card must be scanned at entrance kiosk upon Arrival and Departure.</p>
                    <p>• Replacement fee applies in case of loss or damage.</p>
                    <p>• Issued by {instituteSettings.institute_name} under Vectora Cloud v2.0.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="font-bold text-slate-800 text-xs mb-1">Emergency & Return Address</div>
                    <div>{instituteSettings.address}</div>
                    <div>{instituteSettings.city}, {instituteSettings.state} - {instituteSettings.pin_code}</div>
                    <div className="font-semibold text-indigo-600 mt-1">{instituteSettings.phone}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[9px] text-slate-400">
                  <span>www.vectora.edu</span>
                  <span>Powered by Supabase & Next.js</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
