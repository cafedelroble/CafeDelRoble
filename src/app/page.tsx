export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { Hero } from '@/components/home/hero';
import { Story } from '@/components/home/story';
import { FeaturedProducts } from '@/components/home/featured-products';
import { Newsletter } from '@/components/home/newsletter';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Story />
      <FeaturedProducts />
      <Newsletter />
    </>
  );
}
