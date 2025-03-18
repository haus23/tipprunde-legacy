import { useEffect, useState } from 'react';
import { RemoveScroll } from 'react-remove-scroll';
import { Outlet, ScrollRestoration } from 'react-router';

import { NavDesktop } from '#/components/nav/nav-desktop';
import { NavMobile } from '#/components/nav/nav-mobile';

import { tv } from 'tailwind-variants';
import { useConvexUser } from '#/utils/auth';

const headerStyles = tv({
  base: [
    'fixed inset-0 z-10 h-16 px-2 shadow-transparent shadow-xs transition-colors sm:px-4',
    '[&:not([data-scroll-state=at-top])]:bg-background [&:not([data-scroll-state=at-top])]:shadow-gray-4',
  ],
});

type ScrollState = 'at-top' | 'scrolling-up' | 'scrolling-down';

export default function Layout() {
  useConvexUser();

  const [scrollState, setScrollState] = useState<ScrollState>('at-top');
  useEffect(() => {
    let previousScrollY = window.scrollY;

    function scrollListener() {
      const direction =
        previousScrollY < window.scrollY ? 'scrolling-down' : 'scrolling-up';
      const state = window.scrollY < 16 ? 'at-top' : direction;
      previousScrollY = window.scrollY;
      setScrollState(state);
    }
    window.addEventListener('scroll', scrollListener, { passive: true });
    return () => window.removeEventListener('scroll', scrollListener);
  }, []);

  return (
    <>
      <header
        data-scroll-state={scrollState}
        className={headerStyles({
          className: RemoveScroll.classNames.fullWidth,
        })}
      >
        <NavDesktop />
        <NavMobile />
      </header>
      <main className="mx-auto max-w-5xl pt-20 pb-10 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <ScrollRestoration
        getKey={(location) => {
          return location.pathname;
        }}
      />
    </>
  );
}
