'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Check, Star, Info } from 'lucide-react';
import { fetchApi } from '@/lib/api';

const notes = [
  'Pendaftaran 25rb untuk Member Card',
  'Expired paket 1 bulan',
  'Waktu latihan fleksibel (Atur sendiri)',
  'Harga Private di rumah menyesuaikan jarak',
];

export default function PriceMatrix() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/packages')
      .then(data => {
        if (data && data.length > 0) {
          // Group by category
          const grouped = data.reduce((acc: any, pkg: any) => {
            if (!acc[pkg.category]) acc[pkg.category] = [];
            acc[pkg.category].push({
              name: pkg.name,
              price: pkg.price >= 1000 ? `${pkg.price / 1000}k` : pkg.price.toString()
            });
            return acc;
          }, {});

          const catsArray = Object.keys(grouped).map(catName => ({
            title: catName,
            items: grouped[catName],
            popular: catName === 'Dewasa'
          }));

          // Sort so that Pelajar is first, Dewasa is second
          catsArray.sort((a, b) => {
            if (a.title === 'Pelajar') return -1;
            if (b.title === 'Pelajar') return 1;
            if (a.title === 'Dewasa') return -1;
            if (b.title === 'Dewasa') return 1;
            return 0;
          });

          setCategories(catsArray);
        }
      })
      .catch(err => console.error('Failed to load packages', err));
  }, []);

  return (
    <section id="harga" className="py-20 lg:py-28 bg-[var(--bg-primary)] relative overflow-hidden">
      <div className="absolute inset-0 gym-mesh opacity-20" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-[var(--accent)] tracking-wider uppercase mb-2">
            Daftar Paket & Biaya
          </p>
          <h2
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            DAFTAR HARGA
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-[var(--text-secondary)] font-medium">
            <span className="flex items-center gap-2 bg-[var(--bg-elevated)] px-3 py-1 rounded-full">
              <Check size={16} className="text-[var(--accent)]" /> 1 Sesi Latihan 2 Jam
            </span>
            <span className="flex items-center gap-2 bg-[var(--bg-elevated)] px-3 py-1 rounded-full">
              <Check size={16} className="text-[var(--accent)]" /> Bersama Personal Trainer (PT)
            </span>
            <span className="flex items-center gap-2 bg-[var(--bg-elevated)] px-3 py-1 rounded-full">
              <Check size={16} className="text-[var(--accent)]" /> Alat² Sudah Disediakan
            </span>
          </div>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {categories.map((cat) => (
            <Card
              key={cat.title}
              hover
              glow={cat.popular}
              className={`relative p-8 flex flex-col h-full border-2 ${
                cat.popular
                  ? 'border-[var(--accent)] scale-105 z-10 shadow-[var(--shadow-gold)] bg-[var(--bg-secondary)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-card)]'
              }`}
            >
              {cat.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full gold-gradient text-[10px] font-black text-black tracking-widest uppercase shadow-lg">
                    <Star size={10} fill="currentColor" /> Best Value
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3
                  className="text-3xl font-bold text-[var(--text-primary)] leading-none"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {cat.title}
                </h3>
              </div>

              <div className="space-y-4 flex-1">
                {cat.items.map((item: any) => (
                  <div key={item.name} className="flex items-center justify-between group">
                    <span className="text-sm font-semibold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                      {item.name}
                    </span>
                    <div className="flex-1 border-b-2 border-dotted border-[var(--border-subtle)] mx-2 mb-1" />
                    <span className="text-xl font-bold text-[var(--accent)]" style={{ fontFamily: 'var(--font-display)' }}>
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>

              <Link href="/register" className="mt-8">
                <Button
                  variant={cat.popular ? 'primary' : 'outline'}
                  className="w-full font-bold tracking-wide"
                >
                  PILIH PAKET
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        {/* Footer Notes */}
        <div className="max-w-4xl mx-auto bg-[var(--bg-elevated)] rounded-2xl p-6 sm:p-8 border border-[var(--border-color)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {notes.map((note) => (
              <div key={note} className="flex items-start gap-3">
                <div className="mt-1 bg-[var(--accent)]/10 p-1 rounded">
                  <Info size={14} className="text-[var(--accent)]" />
                </div>
                <p className="text-sm text-[var(--text-secondary)] font-medium leading-tight">
                  {note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
