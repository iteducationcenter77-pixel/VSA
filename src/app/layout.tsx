import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { VectoraProvider } from '@/lib/store';
import { NotificationToast } from '@/components/NotificationToast';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Vectora Smart Attendance — Cloud Enterprise Student & QR Attendance Management System',
  description:
    'Professional cloud-based Smart Attendance Management System for educational institutions. Automates student management, automatic smart ID card generation, QR code attendance check-in/out, and real-time analytics with Supabase.',
  keywords: [
    'Smart Attendance',
    'QR Code Attendance',
    'Student ID Card Generator',
    'Educational Institute Management',
    'Supabase',
    'Next.js',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <VectoraProvider>
          {children}
          <NotificationToast />
        </VectoraProvider>
      </body>
    </html>
  );
}
