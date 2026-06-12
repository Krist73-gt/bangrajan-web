'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Download, Calendar as CalendarIcon, FileSpreadsheet } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function ReportsPage() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [monthYear, setMonthYear] = useState(`${currentMonth}-${currentYear}`);
  const [memberStatus, setMemberStatus] = useState('all');
  
  const [isDownloadingAttendance, setIsDownloadingAttendance] = useState(false);
  const [isDownloadingMembers, setIsDownloadingMembers] = useState(false);

  // Generate options for the last 12 months
  const monthOptions = Array.from({ length: 12 }).map((_, i) => {
    const d = new Date(currentYear, currentMonth - 1 - i, 1);
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    return {
      value: `${m}-${y}`,
      label: d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    };
  });

  const downloadFile = async (endpoint: string, filename: string, setLoading: (s: boolean) => void) => {
    setLoading(true);
    try {
      // Use fetch directly with credentials since fetchApi assumes JSON response usually, 
      // but if fetchApi doesn't throw on text, we can use it.
      // Wait, fetchApi returns res.json() by default if it's successful in our implementation.
      // Let's use direct fetch to handle Blobs.
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const res = await fetch(`${baseUrl}${endpoint}`, {
        credentials: 'include'
      });
      
      if (!res.ok) throw new Error('Gagal download data');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error(err);
      alert('Gagal mendownload laporan');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAttendance = () => {
    const [month, year] = monthYear.split('-');
    downloadFile(`/reports/attendance?month=${month}&year=${year}`, `attendance_${year}-${month.padStart(2, '0')}.csv`, setIsDownloadingAttendance);
  };

  const handleDownloadMembers = () => {
    downloadFile(`/reports/members?status=${memberStatus}`, `members_${memberStatus}.csv`, setIsDownloadingMembers);
  };

  return (
    <div className="animate-fade-up max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 
          className="text-3xl font-bold text-[var(--text-primary)] tracking-wide mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          LAPORAN DATA 📈
        </h1>
        <p className="text-[var(--text-secondary)]">
          Eksport data kehadiran dan member ke format CSV.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kehadiran Bulanan */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <CalendarIcon size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Kehadiran Bulanan</h3>
              <p className="text-sm text-[var(--text-secondary)]">Log check-in harian</p>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Bulan</label>
              <select 
                value={monthYear}
                onChange={(e) => setMonthYear(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-color)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-light)] appearance-none"
              >
                {monthOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <Button variant="outline" className="w-full justify-center" onClick={handleDownloadAttendance} isLoading={isDownloadingAttendance}>
            <Download size={18} /> Download CSV
          </Button>
        </Card>

        {/* Data Member */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-[var(--accent-light)] text-[var(--accent)] rounded-xl">
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Data Member Aktif</h3>
              <p className="text-sm text-[var(--text-secondary)]">Daftar member dan sisa sesi</p>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Status Filter</label>
              <select 
                value={memberStatus}
                onChange={(e) => setMemberStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-color)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-light)] appearance-none"
              >
                <option value="all">Semua Member</option>
                <option value="active">Active Only</option>
                <option value="expired">Expired Only</option>
              </select>
            </div>
          </div>

          <Button variant="primary" className="w-full justify-center" onClick={handleDownloadMembers} isLoading={isDownloadingMembers}>
            <Download size={18} /> Download CSV
          </Button>
        </Card>
      </div>
    </div>
  );
}
