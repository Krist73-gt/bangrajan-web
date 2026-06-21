'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { signIn, forgetPassword } from '@/lib/auth-client';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const { data, error: signInError } = await signIn.email({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message || 'Login gagal. Periksa kembali email dan password Anda.');
        setIsLoading(false);
        return;
      }

      // Check role or redirect to common dashboard
      if ((data?.user as any)?.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan pada sistem.');
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Silakan masukkan email Anda.');
      return;
    }
    setIsLoading(true);
    setError('');
    
    try {
      const { error: forgetError } = await forgetPassword({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (forgetError) {
        setError(forgetError.message || 'Gagal mengirim link reset.');
        setIsLoading(false);
        return;
      }

      setResetSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan pada sistem.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isForgotPassword) {
    return (
      <div className="w-full">
        <div className="text-center mb-8">
          <h2 
            className="text-3xl font-bold text-[var(--text-primary)] tracking-wide mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            LUPA PASSWORD
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Masukkan email terdaftar untuk mengatur ulang password.
          </p>
        </div>

        {resetSuccess ? (
          <div className="text-center mb-8">
            <div className="p-4 mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg">
              Link reset password telah dikirim! (Cek terminal API karena sedang dalam mode simulasi).
            </div>
            <Button onClick={() => { setIsForgotPassword(false); setResetSuccess(false); }} className="w-full">
              Kembali ke Halaman Login
            </Button>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleForgotPassword}>
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
                {error}
              </div>
            )}
            
            <Input
              label="Email"
              type="email"
              placeholder="email@contoh.com"
              icon={<Mail size={18} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" className="w-full h-11" isLoading={isLoading}>
              Kirim Link Reset
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => { setIsForgotPassword(false); setError(''); }}
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                ← Kembali ke Login
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 
          className="text-3xl font-bold text-[var(--text-primary)] tracking-wide mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          MASUK
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Kembali berlatih. Masuk ke akun kamu.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
            {error}
          </div>
        )}
        
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
            placeholder="••••••••"
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

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-[var(--border-color)] bg-[var(--bg-elevated)] text-[var(--accent)] focus:ring-[var(--accent)]"
            />
            <span className="text-[var(--text-secondary)]">Ingat saya</span>
          </label>
          <a href="#" onClick={(e) => { e.preventDefault(); setIsForgotPassword(true); setError(''); }} className="font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">
            Lupa password?
          </a>
        </div>

        <Button type="submit" variant="primary" className="w-full h-11" isLoading={isLoading}>
          🥊 MASUK SEKARANG
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
        Belum punya akun?{' '}
        <Link href="/register" className="font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}
