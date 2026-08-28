export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { Hero } from '@/components/home/hero';
import { Marquee } from '@/components/home/marquee';
import { FeaturedProducts } from '@/components/home/featured-products';
import { Benefits } from '@/components/home/benefits';
import { Story } from '@/components/home/story';
import { Testimonials } from '@/components/home/testimonials';
import { Newsletter } from '@/components/home/newsletter';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <FeaturedProducts />
      <Benefits />
      <Story />
      <Testimonials />
      <Newsletter />
    </>
  );
}