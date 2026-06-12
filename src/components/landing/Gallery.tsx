'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Card from '@/components/ui/Card';
import { fetchApi } from '@/lib/api';

export default function Gallery() {
  const [galleryImages, setGalleryImages] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/website/gallery')
      .then(data => {
        if (data && data.length > 0) {
          setGalleryImages(data);
        } else {
          // Fallback if db is empty
          setGalleryImages([
            { imageUrl: '/images/gym-1.png', title: 'Indoor Training Area' },
            { imageUrl: '/images/gym-2.png', title: 'Professional Boxing Ring' }
          ]);
        }
      })
      .catch(err => {
        console.error('Failed to load gallery', err);
        setGalleryImages([
          { imageUrl: '/images/gym-1.png', title: 'Indoor Training Area' },
          { imageUrl: '/images/gym-2.png', title: 'Professional Boxing Ring' }
        ]);
      });
  }, []);

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-[var(--bg-secondary)] relative overflow-hidden">
      <div className="absolute inset-0 gym-mesh opacity-10" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-medium text-[var(--accent)] tracking-wider uppercase mb-2">
            Dokumentasi Camp
          </p>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            📸 GALLERY KEGIATAN
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {galleryImages.map((image, index) => (
            <Card key={image.id || index} className="group overflow-hidden border-none aspect-video relative">
              <Image
                src={image.imageUrl}
                alt={image.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <p className="text-white font-bold text-lg">{image.title}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
