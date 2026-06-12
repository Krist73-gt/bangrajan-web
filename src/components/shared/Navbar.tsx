'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';
import { Menu, X, Sun, Moon } from 'lucide-react';
import Button from '@/components/ui/Button';

const navLinks = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Harga', href: '#harga' },
  { label: 'Jadwal', href: '#jadwal' },
  { label: 'Lokasi', href: '#lokasi' },
  { label: 'Gallery', href: '#gallery' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled
          ? 'bg-[var(--bg-primary)]/90 backdrop-blur-xl border-b border-[var(--border-color)] shadow-[var(--shadow-sm)]'
          : 'bg-transparent'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🥊</span>
            <span
              className="text-xl lg:text-2xl font-bold tracking-wider"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <span className="gold-text">BANG</span>
              <span className="text-[var(--text-primary)]">RAJAN</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors rounded-lg hover:bg-[var(--accent-light)]"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)] transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link href="/login">
              <Button variant="outline" size="sm">Masuk</Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">Daftar</Button>
            </Link>
          </div>

          {/* Mobile buttons */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          md:hidden overflow-hidden transition-all duration-300 ease-out
          bg-[var(--bg-primary)]/95 backdrop-blur-xl border-b border-[var(--border-color)]
          ${isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0 border-none'}
        `}
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)] rounded-xl transition-all"
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-2 pt-3 border-t border-[var(--border-color)]">
            <Link href="/login" className="flex-1" onClick={() => setIsOpen(false)}>
              <Button variant="outline" size="sm" className="w-full">Masuk</Button>
            </Link>
            <Link href="/register" className="flex-1" onClick={() => setIsOpen(false)}>
              <Button variant="primary" size="sm" className="w-full">Daftar</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
