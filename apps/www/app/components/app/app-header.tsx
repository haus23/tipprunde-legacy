import { PanelLeftIcon, SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { ThemeSelect } from '#/components/app/theme-select';
import { Logo } from '#/components/logo';
import { Button } from '#/components/ui/button';
import { Link } from '#/components/ui/link';
import { useChampionship } from '#/utils/app/championship';

import { useAppShell } from './app-shell';
import { navLinks } from './nav-links';

const headerStyles = [
  'bg-gradient-to-b from-header-from to-header-to',
  'fixed inset-0 z-10 h-16 px-2 font-medium shadow-transparent shadow-xs sm:px-4',
  '[&:not([data-scroll-state=at-top])]:bg-background [&:not([data-scroll-state=at-top])]:bg-none [&:not([data-scroll-state=at-top])]:shadow-elevation',
].join(' ');

type ScrollState = 'at-top' | 'scrolling-up' | 'scrolling-down';

export function AppHeader() {
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

  const championship = useChampionship();

  return (
    <header data-scroll-state={scrollState} className={headerStyles}>
      <div className="flex h-16 justify-between">
        <div className="flex items-center gap-x-2 md:hidden">
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            className="inline md:hidden"
            aria-label="Sidebar-Toggle"
          >
            <PanelLeftIcon className="size-5" />
          </Button>
          <h2 className="text-xl">{championship.name}</h2>
        </div>
        <nav className="hidden items-center gap-x-4 md:flex">
          <Link
            to="/"
            variant="plain"
            className="items-center gap-x-2 py-0 pl-1 md:flex"
          >
            <Logo className="size-10" />
            <span className="text-xl">runde.tips</span>
          </Link>

          <div className="flex h-16 items-stretch gap-x-2">
            {navLinks(championship.id).map((link) => (
              <div key={link.to} className="relative flex items-center px-2">
                <Link
                  {...link}
                  to={link.to}
                  variant="navlink"
                  className="px-4 transition-colors after:absolute after:bottom-1 after:left-0 after:block after:w-full after:border-transparent after:border-b-2 aria-[current]:after:border-accent-border"
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
              onClick={() => setChampionshipSelectOpen(true)}
              variant="ghost"
              className="flex gap-x-1"
              aria-label="Turnier-Auswahl öffnen"
            >
              <SearchIcon className="size-5" />
              <span>Turnier</span>
            </Button>
            <ThemeSelect />
          </div>
        </div>
      </div>
    </header>
  );
}
