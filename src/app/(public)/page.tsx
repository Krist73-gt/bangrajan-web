import Hero from '@/components/landing/Hero';
import PriceMatrix from '@/components/landing/PriceMatrix';
import Gallery from '@/components/landing/Gallery';
import Schedule from '@/components/landing/Schedule';
import Location from '@/components/landing/Location';

export default function HomePage() {
  return (
    <>
      <Hero />
      <PriceMatrix />
      <Gallery />
      <Schedule />
      <Location />
    </>
  );
}
