import { useEffect, useState } from 'react';
import { tv } from 'tailwind-variants';

import { Logo } from '#/components/logo';
import { Link } from '#/components/ui/link';
import { ThemeSelect } from './theme-select';

const headerStyles = tv({
  base: [
    'fixed inset-0 z-10 h-16 px-2 shadow-transparent shadow-xs transition-colors sm:px-4',
    '[&:not([data-scroll-state=at-top])]:bg-background [&:not([data-scroll-state=at-top])]:shadow-gray-4',
  ],
});

type ScrollState = 'at-top' | 'scrolling-up' | 'scrolling-down';

export function AppHeader() {
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
    <header data-scroll-state={scrollState} className={headerStyles()}>
      <div className="flex h-16 justify-between">
        <nav className="flex">
          <Link href="/" className="flex items-center gap-x-2">
            <Logo className="size-10" />
            <span className="text-xl">runde.tips</span>
          </Link>
        </nav>
        <div className="flex items-center">
          <ThemeSelect />
        </div>
      </div>
    </header>
  );
}
