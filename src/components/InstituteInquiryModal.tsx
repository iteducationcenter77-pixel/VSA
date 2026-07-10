'use client';

import React, { useState } from 'react';
import { X, Send, Building2, User, Phone, Mail, MapPin, MessageSquare, Sparkles } from 'lucide-react';

interface InstituteInquiryModalProps {
  onClose: () => void;
}

export const InstituteInquiryModal: React.FC<InstituteInquiryModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    instituteName: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    studentCount: '100 - 500 Students',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    const text = `*NEW VSA INSTITUTE SIGN-UP INQUIRY* 🚀
----------------------------------------
*Institute Name:* ${formData.instituteName}
*Contact Person:* ${formData.contactPerson}
*Phone / WhatsApp:* ${formData.phone}
*Email:* ${formData.email}
*City / Address:* ${formData.address}
*Estimated Students:* ${formData.studentCount}
*Additional Message:* ${formData.message || 'Interested in deploying Vectora Smart Attendance System.'}
----------------------------------------
_Sent from VSA Official Portal_`;

    const encoded = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/918638373298?text=${encoded}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Partner & Deploy VSA For Your Institute
              </h3>
              <p className="text-xs text-slate-300">
                Direct WhatsApp integration with official VSA deployment team (+91 86383 73298)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmitWhatsApp} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Institute / College Name *</span>
            </label>
            <input
              type="text"
              name="instituteName"
              required
              value={formData.instituteName}
              onChange={handleChange}
              placeholder="e.g. Pixel IT Education Center"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-500" />
                <span>Contact Person Name *</span>
              </label>
              <input
                type="text"
                name="contactPerson"
                required
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Principal / Director"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                <span>Mobile / WhatsApp Number *</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-500" />
                <span>Official Email *</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="info@institute.edu"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                <span>City & State *</span>
              </label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="Guwahati, Assam"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Estimated Total Students
            </label>
            <select
              name="studentCount"
              value={formData.studentCount}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="50 - 100 Students">50 - 100 Students</option>
              <option value="100 - 500 Students">100 - 500 Students</option>
              <option value="500 - 2,000 Students">500 - 2,000 Students</option>
              <option value="2,000+ Students (Campus Enterprise)">2,000+ Students (Campus Enterprise)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
              <span>Any Specific Customization Requests? (Optional)</span>
            </label>
            <textarea
              name="message"
              rows={2}
              value={formData.message}
              onChange={handleChange}
              placeholder="e.g. Want Smart ID printing or multi-branch cloud setup"
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Send Inquiry to WhatsApp (+91 86383 73298)</span>
            </button>
            <p className="text-[11px] text-slate-500 text-center mt-2">
              Opens WhatsApp chat directly with +91 86383 73298 to register your institute.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
