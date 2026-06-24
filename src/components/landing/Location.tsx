'use client';

import Card from '@/components/ui/Card';
import { MapPin, Phone, Instagram, Navigation, Accessibility, Coffee, Users, ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Location() {
  return (
    <section id="lokasi" className="py-20 lg:py-28 bg-[var(--bg-primary)] relative overflow-hidden">
      <div className="absolute inset-0 gym-mesh opacity-15" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-sm font-medium text-[var(--accent)] tracking-wider uppercase mb-2">
            Kunjungi Camp Kami
          </p>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            LOKASI & KONTAK
          </h2>
          <p className="mt-4 text-[var(--text-muted)] font-bold tracking-widest uppercase">
            EST 2013
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Map */}
          <div className="space-y-6">
            <Card className="overflow-hidden h-full min-h-[400px] border-2 border-[var(--border-color)]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.518645391307!2d106.7324545!3d-6.3421376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ef42f65a882f%3A0x6e26715f917531!2sPamulang%20Square!5e0!3m2!1sid!2sid!4v1714100000000!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi BangRajan Muaythai Camp"
              />
            </Card>
          </div>

          {/* Info & Facilities */}
          <div className="space-y-6">
            <Card className="p-6 lg:p-8 border border-[var(--border-color)] bg-[var(--bg-card)]">
              <h3
                className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                BANGRAJAN MUAYTHAI
              </h3>

              <ul className="space-y-5 mb-8">
                <li className="flex items-start gap-4">
                  <div className="mt-0.5 p-2 rounded-xl bg-[var(--accent-light)] border border-[var(--accent)]/10">
                    <MapPin size={20} className="text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">Alamat</p>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      Pamulang Square, RUKO PURI PAMULANG,<br />
                      SEBRANG DANAU BLOK A2 No 1, Pamulang Bar., Kec. Pamulang,<br />
                      Kota Tangerang Selatan, Banten 15417
                    </p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <div className="p-2 rounded-xl bg-[var(--accent-light)] border border-[var(--accent)]/10">
                    <Phone size={20} className="text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">Telepon / WA</p>
                    <a href="tel:087876377776" className="text-sm text-[var(--accent)] font-bold hover:underline">
                      0878-7637-7776
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <div className="p-2 rounded-xl bg-[var(--accent-light)] border border-[var(--accent)]/10">
                    <Instagram size={20} className="text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">Instagram</p>
                    <a href="https://instagram.com/Bangrajanmuaythai" target="_blank" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] font-medium">
                      @Bangrajanmuaythai
                    </a>
                  </div>
                </li>
              </ul>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Bangrajan+Muaythai+Pamulang+Square"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary" className="w-full py-6 font-bold tracking-wider">
                  <Navigation size={18} className="mr-2" /> PETUNJUK ARAH
                </Button>
              </a>
            </Card>

            {/* Features & Facilities */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                <div className="flex items-center gap-2 mb-2 text-[var(--accent)]">
                  <Accessibility size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Aksesibilitas</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] font-medium">Pintu masuk & parkir khusus kursi roda</p>
              </Card>
              <Card className="p-4 bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                <div className="flex items-center gap-2 mb-2 text-[var(--accent)]">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Fasilitas</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] font-medium">Toilet & Wi-Fi Gratis</p>
              </Card>
              <Card className="p-4 bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                <div className="flex items-center gap-2 mb-2 text-[var(--accent)]">
                  <Coffee size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Layanan</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] font-medium">Layanan di tempat & luar ruangan</p>
              </Card>
              <Card className="p-4 bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                <div className="flex items-center gap-2 mb-2 text-[var(--accent)]">
                  <Users size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Cocok Untuk</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] font-medium">Anak-anak, Wanita, & Pria</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
