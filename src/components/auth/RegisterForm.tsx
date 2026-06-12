'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import { signUp, signOut } from '@/lib/auth-client';

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Password dan Konfirmasi Password tidak cocok.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const { data, error: signUpError } = await signUp.email({
        email,
        password,
        name,
        phoneNumber: phone // Adding custom field
      } as any); // using as any since phoneNumber might not be in default types

      if (signUpError) {
        setError(signUpError.message || 'Gagal mendaftar. Silakan coba lagi.');
        setIsLoading(false);
        return;
      }

      await signOut(); // Prevent auto-login
      alert('Pendaftaran berhasil! Silakan login.');
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan pada sistem.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 
          className="text-3xl font-bold text-[var(--text-primary)] tracking-wide mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          DAFTAR MEMBER
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Mulai perjalanan Muaythai kamu hari ini.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
            {error}
          </div>
        )}

        <Input
          label="Nama Lengkap"
          type="text"
          placeholder="Nama Sesuai KTP"
          icon={<User size={18} />}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="No. WhatsApp"
          type="tel"
          placeholder="0812-xxxx-xxxx"
          icon={<Phone size={18} />}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <Input
          label="Email"
          type="email"
          placeholder="email@contoh.com"
          icon={<Mail size={18} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Minimal 8 karakter"
            icon={<Lock size={18} />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="relative">
          <Input
            label="Konfirmasi Password"
            type={showConfirm ? 'text' : 'password'}
            placeholder="Ulangi password"
            icon={<Lock size={18} />}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <Button type="submit" variant="primary" className="w-full h-11 mt-2" isLoading={isLoading}>
          🥊 DAFTAR SEKARANG
        </Button>
      </form>

      <div className="mt-8 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--border-color)]" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-[var(--bg-secondary)] text-[var(--text-muted)]">Atau</span>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-[var(--text-secondary)]">
        Sudah punya akun?{' '}
        <Link href="/login" className="font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
