'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';
import { Footer } from './footer';
import { WhatsAppButton } from './whatsapp-button';

const dashboardPaths = ['/admin', '/cuenta'];

function isDashboardPath(pathname: string) {
  return dashboardPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function StoreChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = isDashboardPath(pathname);

  return (
    <>
      {!isDashboard && <Header />}
      <main className="flex-1">{children}</main>
      {!isDashboard && <Footer />}
      {!isDashboard && <WhatsAppButton />}
    </>
  );
}