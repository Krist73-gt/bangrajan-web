'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { resetPassword } from '@/lib/auth-client';
import Link from 'next/link';

function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Password tidak sama. Silakan periksa kembali.');
      return;
    }

    if (password.length < 8) {
      setError('Password minimal harus 8 karakter.');
      return;
    }

    setIsLoading(true);
    
    try {
      const { error: resetError } = await resetPassword({
        newPassword: password,
      });

      if (resetError) {
        setError(resetError.message || 'Gagal mereset password. Link mungkin sudah kadaluarsa.');
        setIsLoading(false);
        return;
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan pada sistem.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full text-center">
        <h2 className="text-2xl font-bold text-emerald-500 mb-4">Password Berhasil Diubah!</h2>
        <p className="text-[var(--text-secondary)] mb-8">
          Password akun Anda telah berhasil direset. Silakan masuk menggunakan password baru Anda.
        </p>
        <Link href="/login">
          <Button variant="primary" className="w-full">
            Kembali ke Halaman Login
          </Button>
        </Link>
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
          RESET PASSWORD
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Buat password baru untuk akun Anda.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
            {error}
          </div>
        )}
        
        <div className="relative">
          <Input
            label="Password Baru"
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

        <Input
          label="Konfirmasi Password Baru"
          type={showPassword ? 'text' : 'password'}
          placeholder="Ulangi password baru"
          icon={<Lock size={18} />}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button type="submit" variant="primary" className="w-full h-11" isLoading={isLoading}>
          Ubah Password
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Memuat halaman reset...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
