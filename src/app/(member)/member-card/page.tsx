'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { Info } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import QRCode from 'react-qr-code';

export default function MemberCardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/dashboard/member/stats')
      .then(data => setStats(data))
      .catch(err => console.error('Failed to load member stats', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="animate-fade-up max-w-md mx-auto mt-4 sm:mt-10 p-8 text-center text-[var(--text-muted)]">Memuat kartu member...</div>;
  }

  if (!stats) {
    return (
      <div className="animate-fade-up max-w-md mx-auto mt-4 sm:mt-10 p-8 text-center bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Belum Ada Profil Member</h2>
        <p className="text-[var(--text-secondary)]">Silakan hubungi Admin untuk mendaftarkan paket latihan Anda sehingga kartu member dapat dibuat.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-up max-w-md mx-auto mt-4 sm:mt-10">
      <div className="text-center mb-8">
        <h1 
          className="text-3xl font-bold text-[var(--text-primary)] tracking-wide mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          KARTU MEMBER
        </h1>
        <p className="text-[var(--text-secondary)]">
          Gunakan QR Code ini untuk check-in.
        </p>
      </div>

      <Card className="relative overflow-hidden border-2 border-[var(--accent)] shadow-[var(--shadow-gold)] mx-4 sm:mx-0 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(212,168,67,0.3)] group cursor-pointer">
        {/* Background texture & interactive glare */}
        <div className="absolute inset-0 diagonal-stripes opacity-30 pointer-events-none group-hover:opacity-50 transition-opacity" />
        <div className="absolute -inset-[100%] bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[spin_4s_linear_infinite] pointer-events-none" />
        
        {/* Card Header */}
        <div className="bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-elevated)] p-6 border-b border-[var(--border-color)] relative z-10">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🥊</span>
            <div>
              <h2 
                className="text-xl font-bold tracking-wider"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <span className="gold-text">BANG</span>
                <span className="text-[var(--text-primary)]">RAJAN</span>
              </h2>
              <p className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase">Muaythai Boxing Camp</p>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 relative z-10 bg-[var(--bg-card)]">
          <div className="mb-8">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Nama Member</p>
            <p className="text-xl font-bold text-[var(--text-primary)]">{stats.fullName || 'Nama Member'}</p>
            
            <div className="mt-4 flex gap-6">
              <div>
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">ID</p>
                <p className="font-medium text-[var(--text-primary)]">{stats.barcode || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Paket</p>
                <p className="font-medium text-[var(--accent)]">{stats.packageName || '-'}</p>
              </div>
            </div>
          </div>

          {/* Barcode Area */}
          <div className="bg-white p-4 rounded-xl flex flex-col items-center justify-center">
            <div className="flex w-full mb-2 justify-center bg-white p-2 rounded-lg">
              <QRCode 
                value={stats.barcode || 'NO-ID'} 
                size={160}
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>
            <p className="mt-2 text-black font-mono text-sm tracking-widest">{stats.barcode || 'NO-ID'}</p>
          </div>
        </div>
      </Card>

      <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] mx-4 sm:mx-0">
        <Info size={20} className="text-[var(--text-muted)] shrink-0 mt-0.5" />
        <p className="text-sm text-[var(--text-secondary)]">
          Tunjukkan barcode ini kepada Admin di meja resepsionis jika kamu tidak membawa kartu fisik. Kecerahan layar maksimal disarankan.
        </p>
      </div>
    </div>
  );
}
