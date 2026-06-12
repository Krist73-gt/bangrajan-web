'use client';

import Link from 'next/link';
import { Instagram, Phone, MapPin, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🥊</span>
              <span
                className="text-xl font-bold tracking-wider"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <span className="gold-text">BANG</span>
                <span className="text-[var(--text-primary)]">RAJAN</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs">
              Latih mental, bentuk fisik, jadi petarung. Camp Muaythai terbaik
              dengan fasilitas lengkap dan pelatih profesional sejak 2013.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className="text-sm font-bold tracking-wider text-[var(--accent)] mb-6 uppercase"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Navigasi
            </h3>
            <ul className="grid grid-cols-2 gap-3">
              {['Beranda', 'Harga', 'Jadwal', 'Lokasi'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors font-medium"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="text-sm font-bold tracking-wider text-[var(--accent)] mb-6 uppercase"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Hubungi Kami
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                <MapPin size={16} className="text-[var(--accent)] shrink-0 mt-0.5" />
                <span>
                  Pamulang Square, Ruko Puri Pamulang, Sebrang Danau Blok A2 No 1, Pamulang Bar., Kec. Pamulang, Kota Tangerang Selatan
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-[var(--text-secondary)] font-bold">
                <Phone size={16} className="text-[var(--accent)] shrink-0" />
                <a href="tel:087876377776" className="hover:text-[var(--accent)] transition-colors">
                  0878-7637-7776
                </a>
              </li>
            </ul>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://instagram.com/Bangrajanmuaythai"
                target="_blank"
                className="p-2 rounded-xl bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)] transition-all border border-[var(--border-color)]"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://wa.me/6287876377776"
                target="_blank"
                className="p-2 rounded-xl bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)] transition-all border border-[var(--border-color)]"
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)] font-medium">
            © 2026 BangRajan Muaythai. Established 2013.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] uppercase tracking-widest font-bold">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] uppercase tracking-widest font-bold">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
