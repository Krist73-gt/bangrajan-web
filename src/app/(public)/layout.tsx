import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import BackgroundSlider from '@/components/ui/BackgroundSlider';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-[-1]">
        <BackgroundSlider opacity={0.08} darkOpacity={0.15} />
        <div className="absolute inset-0 hero-gradient opacity-90" />
      </div>
      <Navbar />
      <main className="flex-1 relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
