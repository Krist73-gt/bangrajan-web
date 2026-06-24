'use client';

import { useEffect, useState, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Clock } from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface ScheduleRow {
  dayName: string;
  dayOrder: number;
  openTime: string | null;
  closeTime: string | null;
  isHoliday: boolean;
}

const defaultSchedule: ScheduleRow[] = [
  { dayName: 'Senin', dayOrder: 1, openTime: null, closeTime: null, isHoliday: true },
  { dayName: 'Selasa', dayOrder: 2, openTime: '09:00', closeTime: '21:00', isHoliday: false },
  { dayName: 'Rabu', dayOrder: 3, openTime: '09:00', closeTime: '21:00', isHoliday: false },
  { dayName: 'Kamis', dayOrder: 4, openTime: '09:00', closeTime: '21:00', isHoliday: false },
  { dayName: 'Jumat', dayOrder: 5, openTime: '09:00', closeTime: '21:00', isHoliday: false },
  { dayName: 'Sabtu', dayOrder: 6, openTime: '09:00', closeTime: '18:00', isHoliday: false },
  { dayName: 'Minggu', dayOrder: 7, openTime: '09:00', closeTime: '21:00', isHoliday: false },
];

export default function Schedule() {
  const [schedules, setSchedules] = useState<ScheduleRow[]>(defaultSchedule);
  const [status, setStatus] = useState({ isOpen: false, message: 'Memuat status...' });

  const getCampStatus = useCallback((scheds: ScheduleRow[]) => {
    if (!scheds || scheds.length === 0) return { isOpen: false, message: '' };
    
    const now = new Date();
    // JS getDay(): 0=Sun, 1=Mon, ..., 6=Sat
    // Our DB dayOrder: 1=Mon, 2=Tue, ..., 7=Sun
    const jsDay = now.getDay();
    const currentDayOrder = jsDay === 0 ? 7 : jsDay;
    
    const todaySched = scheds.find(s => s.dayOrder === currentDayOrder);
    if (!todaySched || todaySched.isHoliday) {
      return { isOpen: false, message: `Hari ${todaySched?.dayName || ''} - LIBUR` };
    }

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes;

    const [openH, openM] = (todaySched.openTime || '09:00').split(':').map(Number);
    const [closeH, closeM] = (todaySched.closeTime || '21:00').split(':').map(Number);
    
    const openTime = openH * 60 + openM;
    const closeTime = closeH * 60 + closeM;

    if (currentTime >= openTime && currentTime < closeTime) {
      return { isOpen: true, message: `Tutup pukul ${todaySched.closeTime}` };
    }
    
    if (currentTime < openTime) {
      return { isOpen: false, message: `Buka pukul ${todaySched.openTime}` };
    }
    
    // find next open day
    let nextDayOrder = currentDayOrder + 1;
    if (nextDayOrder > 7) nextDayOrder = 1;
    const nextSched = scheds.find(s => s.dayOrder === nextDayOrder);
    
    return { isOpen: false, message: `Buka besok pukul ${nextSched?.openTime || '09:00'}` };
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchApi('/website/schedules').then(data => {
      if (mounted && data && data.length > 0) {
        setSchedules(data);
        setStatus(getCampStatus(data));
      }
    }).catch(err => console.error('Failed to load schedules', err));
    return () => { mounted = false; };
  }, [getCampStatus]);

  useEffect(() => {
    const interval = setInterval(() => setStatus(getCampStatus(schedules)), 60000);
    return () => clearInterval(interval);
  }, [schedules, getCampStatus]);

  return (
    <section id="jadwal" className="py-20 lg:py-28 bg-[var(--bg-secondary)] relative overflow-hidden">
      <div className="absolute inset-0 gym-mesh opacity-15" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-sm font-medium text-[var(--accent)] tracking-wider uppercase mb-2">
            Jam Operasional
          </p>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            JADWAL LATIHAN
          </h2>
        </div>

        {/* Live Status */}
        <div className="max-w-2xl mx-auto mb-10">
          <Card className="p-5 flex items-center justify-between border-2 border-[var(--accent)]/20" glow={status.isOpen}>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${status.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-fight-500'}`} />
              <div>
                <p className="font-semibold text-[var(--text-primary)]">
                  Status Camp: {' '}
                  <span className={status.isOpen ? 'text-emerald-500' : 'text-fight-500'}>
                    {status.isOpen ? 'BUKA' : 'TUTUP'}
                  </span>
                </p>
                <p className="text-xs text-[var(--text-muted)]">{status.message}</p>
              </div>
            </div>
            <Badge variant={status.isOpen ? 'success' : 'danger'}>
              <Clock size={12} className="mr-1" /> Live
            </Badge>
          </Card>
        </div>

        {/* Schedule Table */}
        <div className="max-w-xl mx-auto">
          <Card className="overflow-hidden border border-[var(--border-color)]">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--bg-elevated)] border-b border-[var(--border-color)]">
                  <th className="px-6 py-4 text-left text-xs font-bold text-[var(--accent)] tracking-wider uppercase">
                    Hari
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-[var(--accent)] tracking-wider uppercase">
                    Waktu Latihan
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {schedules.map((row) => {
                  const isLibur = row.isHoliday || !row.openTime || !row.closeTime;
                  const hoursStr = isLibur ? 'LIBUR' : `${row.openTime?.slice(0,5)} - ${row.closeTime?.slice(0,5)}`;
                  return (
                    <tr
                      key={row.dayOrder}
                      className={`transition-colors hover:bg-[var(--accent-light)]
                        ${row.isHoliday ? 'bg-fight-500/5' : ''}`}
                    >
                      <td className="px-6 py-4 text-sm font-bold text-[var(--text-primary)]">
                        {row.dayName}
                      </td>
                      <td className={`px-6 py-4 text-sm text-right font-medium ${
                        isLibur ? 'text-fight-500' : 'text-[var(--text-secondary)]'
                      }`}>
                        {hoursStr}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </section>
  );
}
