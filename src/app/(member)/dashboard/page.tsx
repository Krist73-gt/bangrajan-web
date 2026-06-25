'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import StatusCard from '@/components/member/StatusCard';
import TrainingChart from '@/components/member/TrainingChart';
import Announcements from '@/components/member/Announcements';
import { CheckCircle2, History, X } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function MemberDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [activityHistory, setActivityHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const openHistoryModal = async () => {
    setIsHistoryModalOpen(true);
    setIsLoadingHistory(true);
    try {
      const history = await fetchApi('/dashboard/member/activity');
      setActivityHistory(history || []);
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchApi('/dashboard/member/stats')
      .then(data => setStats(data))
      .catch(err => console.error('Failed to load member stats', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="animate-fade-up p-8 text-center text-[var(--text-muted)]">Memuat dashboard...</div>;
  }

  if (!stats) {
    return (
      <div className="animate-fade-up p-8 text-center bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl max-w-lg mx-auto mt-10">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Profil Tidak Ditemukan</h2>
        <p className="text-[var(--text-secondary)]">Silakan buat ulang profil atau hubungi Admin.</p>
      </div>
    );
  }

  if (stats.status === 'Pending') {
    return (
      <div className="animate-fade-up p-8 text-center bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl max-w-lg mx-auto mt-10">
        <div className="flex justify-center mb-4 text-amber-500">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Menunggu Aktivasi Admin</h2>
        <p className="text-[var(--text-secondary)]">
          Akun Anda telah terdaftar. Silakan hubungi admin di Camp untuk melakukan pembayaran dan aktivasi paket latihan Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 
          className="text-3xl font-bold text-[var(--text-primary)] tracking-wide"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Halo! 👋
        </h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Selamat datang kembali. Siap untuk latihan hari ini?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          <StatusCard stats={stats} />
          
          <Card className="p-6">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Progress Latihan (4 Minggu Terakhir)</h3>
            <div className="flex items-center gap-6 mb-2">
              <div>
                <p className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>{stats.totalTrainingThisMonth}</p>
                <p className="text-xs text-[var(--text-muted)]">Total Latihan</p>
              </div>
              <div className="w-px h-10 bg-[var(--border-color)]" />
              <div>
                <p className="text-3xl font-bold text-[var(--accent)]" style={{ fontFamily: 'var(--font-display)' }}>{stats.avgPerWeek}</p>
                <p className="text-xs text-[var(--text-muted)]">Rata-rata / Minggu</p>
              </div>
            </div>
            {/* The chart data is generated locally from recentLogs */}
            <TrainingChart logs={stats.recentLogs || []} />
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:space-y-8">
          <div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <span className="text-2xl">📢</span> Pengumuman Camp
            </h3>
            <Announcements />
          </div>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Riwayat Terakhir</h3>
              <button 
                onClick={openHistoryModal}
                className="text-xs font-bold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors flex items-center gap-1 bg-[var(--accent)]/10 px-3 py-1.5 rounded-full"
              >
                <History size={14} /> Lihat Semua
              </button>
            </div>
            {stats.recentLogs && stats.recentLogs.length > 0 ? (
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[var(--border-color)] before:via-[var(--border-color)] before:to-transparent">
                {stats.recentLogs.map((log: any, i: number) => {
                  const dateObj = new Date(log.checkinTime);
                  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
                  const dateStr = `${dateObj.getUTCDate().toString().padStart(2, '0')} ${months[dateObj.getUTCMonth()]}`;
                  const timeStr = `${dateObj.getUTCHours().toString().padStart(2, '0')}:${dateObj.getUTCMinutes().toString().padStart(2, '0')}`;
                  return (
                    <div key={log.id || i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 border-[var(--bg-secondary)] bg-[var(--bg-secondary)] ${log.status === 'Berhasil' ? 'text-emerald-500' : 'text-red-500'} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10`}>
                        <CheckCircle2 size={16} />
                      </div>
                      <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-medium text-[var(--text-primary)] text-sm">{dateStr}</div>
                          <div className="text-xs text-[var(--text-muted)]">{timeStr} WIB</div>
                        </div>
                        <div className={`text-xs font-medium ${log.status === 'Berhasil' ? 'text-emerald-500' : 'text-red-500'}`}>
                          {log.status === 'Berhasil' ? '✅ Hadir' : '❌ Gagal'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-[var(--text-muted)] italic">Belum ada riwayat check-in.</p>
            )}
          </Card>
        </div>
      </div>

      {/* History / Audit Log Modal */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-6 bg-[var(--bg-primary)] border border-[var(--border-color)] max-h-[90vh] flex flex-col animate-fade-up">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Riwayat Aktivitas</h3>
                <p className="text-sm text-[var(--text-secondary)]">{stats?.fullName || 'Semua catatan aktivitas'}</p>
              </div>
              <button onClick={() => setIsHistoryModalOpen(false)} className="text-[var(--text-muted)] hover:text-white"><X size={20}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {isLoadingHistory ? (
                <div className="text-center py-8 text-[var(--text-muted)]">Memuat riwayat...</div>
              ) : activityHistory.length === 0 ? (
                <div className="text-center py-8 text-[var(--text-muted)] border border-dashed border-[var(--border-color)] rounded-xl">
                  Belum ada catatan aktivitas.
                </div>
              ) : (
                <div className="relative border-l-2 border-[var(--border-color)] ml-3 pl-6 space-y-6">
                  {activityHistory.map((item, index) => (
                    <div key={index} className="relative">
                      {/* Timeline Dot */}
                      <span className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-[var(--bg-primary)] ${
                        item.type === 'checkin' ? (item.action === 'Berhasil' ? 'bg-emerald-500' : 'bg-fight-500') : 'bg-blue-500'
                      }`} />
                      
                      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3">
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-sm font-bold ${
                            item.type === 'checkin' ? (item.action === 'Berhasil' ? 'text-emerald-500' : 'text-fight-500') : 'text-blue-500'
                          }`}>
                            {item.type === 'checkin' ? `Check-in ${item.action}` : 
                              item.action === 'renew' ? 'Perpanjang Paket' : 
                              item.action === 'add_session' ? 'Tambah Sesi Manual' : 'Kurangi Sesi Manual'}
                          </span>
                          <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">
                            {new Date(item.createdAt).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--text-primary)] mb-1">
                          {item.description || '-'}
                        </p>
                        {item.createdBy && (
                          <p className="text-xs text-[var(--text-secondary)] italic">Oleh: {item.createdBy}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-6 flex justify-end mt-2">
              <button 
                type="button"
                className="px-4 py-2 border border-[var(--border-color)] rounded-xl font-bold text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
                onClick={() => setIsHistoryModalOpen(false)}>
                Tutup
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
