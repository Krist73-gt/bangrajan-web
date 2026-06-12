import Link from 'next/link';
import BackgroundSlider from '@/components/ui/BackgroundSlider';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <BackgroundSlider opacity={0.1} darkOpacity={0.2} />
      <div className="absolute inset-0 hero-gradient opacity-90 z-1" />
      <div className="absolute inset-0 gym-mesh opacity-20 z-2" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="flex justify-center items-center gap-2 mb-6 group">
          <span className="text-3xl">🥊</span>
          <span
            className="text-3xl font-bold tracking-wider"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span className="gold-text">BANG</span>
            <span className="text-[var(--text-primary)]">RAJAN</span>
          </span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-fade-up">
        <div className="bg-[var(--bg-secondary)] py-8 px-4 shadow-[var(--shadow-lg)] sm:rounded-2xl sm:px-10 border border-[var(--border-color)]">
          {children}
        </div>
      </div>
    </div>
  );
}
