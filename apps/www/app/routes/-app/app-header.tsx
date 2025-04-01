import { getRouteApi, useLoaderData } from '@tanstack/react-router';
import { PanelLeftIcon, SearchIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { tv } from 'tailwind-variants';

import { Logo } from '#/components/logo';
import { ThemeSelect } from '#/components/theme-select';
import { Button } from '#/components/ui/button';
import { Link } from '#/components/ui/link';
import { UserMenu } from '#/components/user-menu';
import { useFeatureFlag } from '#/utils/convex';

import { TriggerButton } from '../-chat/trigger-button';
import { useAppShell } from './app-shell';
import { navLinks } from './nav-links';

const routeApi = getRouteApi('__root__');

const headerStyles = tv({
  base: [
    'fixed inset-0 z-10 h-16 px-2 font-medium shadow-transparent shadow-xs transition-colors sm:px-4',
    '[&:not([data-scroll-state=at-top])]:bg-background [&:not([data-scroll-state=at-top])]:shadow-gray-4',
  ],
});

type ScrollState = 'at-top' | 'scrolling-up' | 'scrolling-down';

export function AppHeader() {
  const isChatEnabled = useFeatureFlag('chat');

  const { toggleSidebar, setChampionshipSelectOpen } = useAppShell();

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
  const { championship } = useLoaderData({ from: '__root__' });

  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (headerRef.current)
      headerRef.current.style.right =
        document.documentElement.style.paddingRight;
  });

  return (
    <header
      ref={headerRef}
      data-scroll-state={scrollState}
      className={headerStyles()}
    >
      <div className="flex h-16 justify-between">
        <div className="flex items-center gap-x-2 md:hidden">
          <Button
            onPress={toggleSidebar}
            variant="ghost"
            className="inline md:hidden"
            aria-label="Sidebar-Toggle"
          >
            <PanelLeftIcon className="size-5" />
          </Button>
          <h2 className="text-xl">{championship.name}</h2>
        </div>
        <nav className="hidden items-center gap-x-4 md:flex">
          <Link to="/" className="items-center gap-x-2 py-0 pl-1 md:flex">
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
                  variant="navlink"
                  className="px-4 transition-colors after:absolute after:bottom-1 after:left-0 after:block after:w-full after:border-transparent after:border-b-2 aria-[current]:after:border-accent-7"
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </div>
        </nav>
        <div className="flex items-center gap-x-2">
          <div className="hidden items-center gap-x-2 md:flex">
            <Button
              onPress={() => setChampionshipSelectOpen(true)}
              variant="ghost"
              className="flex gap-x-1"
              aria-label="Turnier-Auswahl öffnen"
            >
              <SearchIcon className="size-5" />
              <span>Turnier</span>
            </Button>
            <ThemeSelect />
            {isChatEnabled && <UserMenu />}
          </div>
          {isChatEnabled && <TriggerButton />}
        </div>
      </div>
    </header>
  );
}
