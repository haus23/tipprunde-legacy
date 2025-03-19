import { useEffect, useState } from 'react';
import { tv } from 'tailwind-variants';

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
      <span>runde.tips</span>
    </header>
  );
}
