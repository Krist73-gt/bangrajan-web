'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';
import { Users, Camera, AlertTriangle, TrendingUp, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const result = await fetchApi('/dashboard/admin/stats');
        setData(result);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-[var(--text-secondary)]">Memuat data dashboard...</div>;
  }

  if (!data) {
    return <div className="p-8 text-center text-red-500">Gagal memuat data.</div>;
  }

  const stats = [
    { name: 'Total Member', value: data.totalMembers || 0, icon: Users, change: 'Aktif saat ini', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Check-in Hari Ini', value: data.todayCheckins || 0, icon: Camera, change: 'Total sesi', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Segera Expired', value: data.expiringSoon || 0, icon: AlertTriangle, change: '< 3 Hari', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { name: 'Member Baru', value: data.newMembersThisMonth || 0, icon: TrendingUp, change: 'Bulan Ini', color: 'text-[var(--accent)]', bg: 'bg-[var(--accent-light)]' },
  ];

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 
          className="text-3xl font-bold text-[var(--text-primary)] tracking-wide mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          PANEL ADMIN
        </h1>
        <p className="text-[var(--text-secondary)]">
          Ringkasan aktivitas dan status camp hari ini.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-5 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                <stat.icon size={20} className={stat.color} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                {stat.value}
              </p>
              <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{stat.name}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{stat.change}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Check-ins */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Check-in Terakhir</h3>
            <Link href="/admin/check-in" className="text-xs font-medium text-[var(--accent)] hover:text-fight-500 transition-colors flex items-center gap-1">
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-4">
            {data.recentCheckins && data.recentCheckins.length > 0 ? (
              data.recentCheckins.map((log: any, i: number) => {
                const dateObj = new Date(log.checkinTime);
                const time = `${dateObj.getUTCHours().toString().padStart(2, '0')}:${dateObj.getUTCMinutes().toString().padStart(2, '0')}`;
                const isSuccess = log.status === 'SUCCESS' || log.status === 'Berhasil';
                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isSuccess ? 'bg-emerald-500/10 text-emerald-500' : 'bg-fight-500/10 text-fight-500'}`}>
                        {isSuccess ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{log.memberName || log.member?.barcode || '-'}</p>
                        <p className="text-xs text-[var(--text-muted)]">{time} WIB</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={isSuccess ? 'success' : 'danger'}>
                        {isSuccess ? `${log.sessions || 0} Sesi Sisa` : log.status}
                      </Badge>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-[var(--text-muted)]">Belum ada check-in hari ini.</p>
            )}
          </div>
        </Card>

        {/* Expiring Soon */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Segera Expired (H-3)</h3>
            <Link href="/admin/members" className="text-xs font-medium text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1">
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-4">
            {data.expiringMembers && data.expiringMembers.length > 0 ? (
              data.expiringMembers.map((member: any, i: number) => {
                const isExpired = member.daysLeft === 0;
                const warning = member.remainingSessions <= 1 || isExpired;
                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-10 rounded-full ${warning ? 'bg-fight-500' : 'bg-amber-500'}`} />
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{member.fullName}</p>
                        <p className="text-xs text-[var(--text-muted)]">{member.remainingSessions} sesi tersisa</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <span className="text-xs font-medium text-[var(--text-primary)]">
                        {isExpired ? 'Expired' : `${member.daysLeft} Hari Lagi`}
                      </span>
                      <Link href={`/admin/members?search=${encodeURIComponent(member.fullName || '')}`} className="px-2 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[10px] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors">
                        Follow up
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-[var(--text-muted)]">Tidak ada member yang segera expired.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
