'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const silhouettes = [
  '/images/silhouettes/s1.png',
  '/images/silhouettes/s2.png',
  '/images/silhouettes/s3.png',
];

interface BackgroundSliderProps {
  opacity?: number;
  darkOpacity?: number;
}

export default function BackgroundSlider({ 
  opacity = 0.15, 
  darkOpacity = 0.3 
}: BackgroundSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % silhouettes.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {silhouettes.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={src}
            alt="Muay Thai Background"
            fill
            className="object-cover mix-blend-luminosity dark:mix-blend-overlay"
            style={{ 
              opacity: typeof window !== 'undefined' && document.documentElement.classList.contains('dark') 
                ? darkOpacity 
                : opacity 
            }}
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
}
