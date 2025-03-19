import { getRouteApi, linkOptions, useLinkProps } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { tv } from 'tailwind-variants';

import { Logo } from '#/components/logo';
import { Link } from '#/components/ui/link';
import { TriggerButton } from '../-chat/trigger-button';
import { ChampionshipSelect } from './championship-select';
import { ThemeSelect } from './theme-select';
import { UserMenu } from './user-menu';

const navLinks = linkOptions([
  {
    to: '/',
    label: 'Tabelle',
    activeOptions: { exact: true },
  },
  {
    to: '/spieler',
    label: 'Spieler',
  },
  {
    to: '/spiele',
    label: 'Spiele',
  },
]);

const routeApi = getRouteApi('__root__');

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

  const { turnier } = routeApi.useSearch();

  return (
    <header data-scroll-state={scrollState} className={headerStyles()}>
      <div className="flex h-16 justify-between">
        <nav className="flex items-center gap-x-4">
          <Link to="/" className="flex items-center gap-x-2 pr-2 pl-1">
            <Logo className="size-10" />
            <span className="text-xl">runde.tips</span>
          </Link>
          <div className="flex h-16 items-stretch gap-x-2">
            {navLinks.map((link) => (
              <div key={link.to} className="relative flex items-center px-2">
                <Link
                  {...link}
                  to={link.to}
                  search={{ turnier }}
                  className="px-4 py-2 transition-colors after:absolute after:bottom-1 after:left-0 after:block after:w-full after:border-transparent after:border-b-2 hover:bg-accent-4 aria-[current]:after:border-accent-7"
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </div>
        </nav>
        <div className="flex items-center gap-x-2">
          <ChampionshipSelect />
          <ThemeSelect />
          <TriggerButton />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
