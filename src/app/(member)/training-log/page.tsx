'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function TrainingLogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/dashboard/member/stats')
      .then(data => {
        if (data && data.recentLogs) {
          setLogs(data.recentLogs);
        }
      })
      .catch(err => console.error('Failed to load training logs:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-up">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 
            className="text-3xl font-bold text-[var(--text-primary)] tracking-wide mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            LOG LATIHAN
          </h1>
          <p className="text-[var(--text-secondary)]">
            Riwayat kehadiran dan penggunaan sesi kamu.
          </p>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-sm hover:border-[var(--accent)] hover:shadow-md transition-all cursor-pointer group">
          <div className="p-2 bg-[var(--accent-light)] rounded-lg group-hover:bg-[var(--accent)] transition-colors">
            <Calendar className="text-[var(--accent)] group-hover:text-white transition-colors" size={20} />
          </div>
          <div className="pr-2">
            <p className="text-xs text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors">Pilih Periode</p>
            <select className="text-sm font-bold text-[var(--text-primary)] bg-transparent focus:outline-none cursor-pointer appearance-none pr-4">
              <option>Bulan Ini</option>
            </select>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-elevated)] border-b border-[var(--border-color)]">
                <th className="p-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Tanggal</th>
                <th className="p-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Waktu</th>
                <th className="p-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden sm:table-cell">Paket</th>
                <th className="p-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-right">Potongan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {loading ? (
                <tr><td colSpan={5} className="p-4 text-center text-sm text-[var(--text-muted)]">Memuat data...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} className="p-4 text-center text-sm text-[var(--text-muted)]">Belum ada riwayat check-in.</td></tr>
              ) : (
                logs.map((log: any, i: number) => {
                  const dateObj = new Date(log.checkinTime);
                  const isSuccess = log.status === 'Berhasil' || log.status === 'SUCCESS';
                  return (
                    <tr key={log.id || i} className="hover:bg-[var(--bg-elevated)] transition-colors">
                      <td className="p-4">
                        <p className="text-sm font-medium text-[var(--text-primary)]">
                          {dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </td>
                      <td className="p-4 text-sm text-[var(--text-secondary)]">
                        {dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-4 text-sm text-[var(--text-secondary)] hidden sm:table-cell">{log.packageName || '-'}</td>
                      <td className="p-4">
                        <Badge variant={isSuccess ? 'success' : 'danger'} className="gap-1.5 px-2.5 py-1">
                          {isSuccess ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                          {isSuccess ? 'Hadir' : 'Gagal'}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <span className={`text-sm font-bold ${isSuccess ? 'text-fight-500' : 'text-[var(--text-muted)]'}`}>
                          {isSuccess ? `-1` : '-'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] flex justify-between items-center text-sm">
          <span className="text-[var(--text-secondary)]">Menampilkan {logs.length} data terakhir</span>
        </div>
      </Card>
    </div>
  );
}
