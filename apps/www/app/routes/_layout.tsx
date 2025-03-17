import { useEffect, useState } from 'react';
import { Outlet, ScrollRestoration } from 'react-router';

import { NavDesktop } from '#/components/nav/nav-desktop';
import { NavMobile } from '#/components/nav/nav-mobile';

import { useConvexUser } from '#/utils/auth';

export default function Layout() {
  useConvexUser();

  const [scrollState, setScrollState] = useState<'at-top' | 'scrolled'>(
    'at-top',
  );
  useEffect(() => {
    function scrollListener(ev: Event) {
      setScrollState(window.scrollY < 10 ? 'at-top' : 'scrolled');
    }
    window.addEventListener('scroll', scrollListener);
    return () => window.removeEventListener('scroll', scrollListener);
  }, []);

  return (
    <div>
      <header
        data-scroll-state={scrollState}
        className="fixed inset-0 z-10 h-16 px-2 font-medium shadow-gray-4 transition-colors data-[scroll-state=scrolled]:bg-background data-[scroll-state=scrolled]:shadow-2xs sm:px-4"
      >
        <NavDesktop />
        <NavMobile />
      </header>
      <main className="mx-auto mt-20 max-w-5xl pb-10 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <ScrollRestoration
        getKey={(location) => {
          return location.pathname;
        }}
      />
    </div>
  );
}
