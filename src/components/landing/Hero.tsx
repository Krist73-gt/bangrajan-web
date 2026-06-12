'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import Button from '@/components/ui/Button';
import { ChevronDown, Users, Award, Clock } from 'lucide-react';
import BackgroundSlider from '@/components/ui/BackgroundSlider';

const initialStats = [
  { id: 'members', icon: Users, value: '500+', label: 'Member Aktif' },
  { id: 'trainers', icon: Award, value: '5+', label: 'Pelatih Pro' },
  { id: 'experience', icon: Clock, value: '10+', label: 'Tahun Pengalaman' },
];

export default function Hero() {
  const [statsData, setStatsData] = useState(initialStats);

  useEffect(() => {
    fetchApi('/website/stats')
      .then((res) => {
        if (res && res.activeMembers) {
          setStatsData((prev) =>
            prev.map((s) =>
              s.id === 'members' ? { ...s, value: `${res.activeMembers}+` } : s
            )
          );
        }
      })
      .catch((err) => console.error('Failed to load stats:', err));
  }, []);
  return (
    <section
      id="beranda"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Silhouette */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src="/images/silhouettes/s2.png"
          alt="Muay Thai Silhouette"
          fill
          className="object-cover mix-blend-luminosity dark:mix-blend-overlay opacity-20 dark:opacity-30"
          priority
        />
      </div>

      {/* Hero specific gradients and mesh */}
      <div className="absolute inset-0 hero-gradient opacity-95 dark:opacity-100 z-1" />
      <div className="absolute inset-0 gym-mesh opacity-30 dark:opacity-40 z-2" />

      {/* Decorative ring ropes - top */}
      <div className="absolute top-0 left-0 right-0">
        <div className="h-1 gold-gradient opacity-60" />
        <div className="h-[1px] gold-gradient opacity-30 mt-2" />
        <div className="h-[1px] gold-gradient opacity-15 mt-2" />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 rounded-full bg-gold-500/5 animate-float" />
      <div className="absolute bottom-1/3 right-16 w-32 h-32 rounded-full bg-gold-500/5 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-fight-500/5 animate-float" style={{ animationDelay: '2s' }} />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-32">
        {/* Badge */}
        <div className="animate-fade-in inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-light)] border border-[var(--accent)]/20 mb-8">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
          <span className="text-xs font-medium text-[var(--accent)] tracking-wide uppercase">
            Camp Buka Sekarang
          </span>
        </div>

        {/* Main heading */}
        <h1
          className="animate-fade-up text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight leading-[0.9] mb-6"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <span className="gold-text">BANGRAJAN</span>
          <br />
          <span className="text-[var(--text-primary)]">MUAYTHAI</span>
          <br />
          <span className="text-[var(--text-secondary)] text-4xl sm:text-5xl lg:text-6xl">
            BOXING CAMP
          </span>
        </h1>

        {/* Tagline */}
        <p
          className="animate-fade-up text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ animationDelay: '0.2s' }}
        >
          Latih mental. Bentuk fisik. <span className="text-[var(--accent)] font-semibold">Jadi petarung.</span>
          <br className="hidden sm:block" />
          Tempat terbaik untuk memulai perjalanan Muaythai-mu.
        </p>

        {/* CTA Buttons */}
        <div
          className="animate-fade-up flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          style={{ animationDelay: '0.4s' }}
        >
          <Link href="/register">
            <Button size="lg" className="min-w-[200px] animate-pulse-gold">
              🥊 Gabung Sekarang
            </Button>
          </Link>
          <a href="#harga">
            <Button variant="outline" size="lg" className="min-w-[200px]">
              Lihat Harga
            </Button>
          </a>
        </div>

        {/* Stats */}
        <div
          className="animate-fade-up grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto mb-20"
          style={{ animationDelay: '0.6s' }}
        >
          {statsData.map((stat) => (
            <div key={stat.label} className="text-center group">
              <stat.icon
                size={24}
                className="mx-auto mb-2 text-[var(--accent)] group-hover:scale-110 transition-transform"
              />
              <p
                className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {stat.value}
              </p>
              <p className="text-xs text-[var(--text-muted)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
        <a href="#harga" className="p-2 rounded-full bg-[var(--bg-elevated)]/50 backdrop-blur-sm border border-[var(--border-color)]">
          <ChevronDown size={24} className="text-[var(--accent)]" />
        </a>
      </div>

    </section>
  );
}
