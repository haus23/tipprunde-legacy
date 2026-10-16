import { PanelLeftIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { ThemeSelect } from '#/components/app/theme-select';
import { Logo } from '#/components/logo';
import { Button } from '#/components/ui/button';
import { Link } from '#/components/ui/link';
import { useChampionship } from '#/utils/app/championship';
import { cn } from '#/utils/cn';

import { useAppShell } from './app-shell';
import { ChampionshipSelect } from './championship-select';
import { navLinks } from './nav-links';

const headerStyles = [
  'bg-gradient-to-b from-header-from to-header-to',
  'fixed inset-0 z-10 h-16 px-2 font-medium shadow-transparent shadow-xs sm:px-4',
  '[&:not([data-scroll-state=at-top])]:bg-background [&:not([data-scroll-state=at-top])]:bg-none [&:not([data-scroll-state=at-top])]:shadow-elevation',
].join(' ');

type ScrollState = 'at-top' | 'scrolling-up' | 'scrolling-down';

// Header bar: fixed, width-limited row, solid background once scrolled.
function HeaderFrame({ children }: { children: React.ReactNode }) {
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
    <header data-scroll-state={scrollState} className={headerStyles}>
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-x-2">
        {children}
      </div>
    </header>
  );
}

function HomeLink({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      variant="plain"
      className={cn('flex items-center gap-x-2 py-0 pl-1', className)}
    >
      <Logo className="size-10" />
      <span className="text-xl">runde.tips</span>
    </Link>
  );
}

// Header without championship data, e.g. when they could not be loaded.
export function BareHeader() {
  return (
    <HeaderFrame>
      <HomeLink />
      <div className="ml-auto">
        <ThemeSelect />
      </div>
    </HeaderFrame>
  );
}

export function AppHeader() {
  const { toggleSidebar } = useAppShell();
  const championship = useChampionship();

  return (
    <HeaderFrame>
      <Button
        onClick={toggleSidebar}
        variant="ghost"
        className="md:hidden"
        aria-label="Menü öffnen"
      >
        <PanelLeftIcon className="size-5" />
      </Button>
      <nav className="hidden items-center gap-x-4 md:flex">
        <HomeLink />

        <div className="flex h-16 items-stretch gap-x-2">
          {navLinks(championship.id).map((link) => (
            <div key={link.to} className="relative flex items-center px-2">
              <Link
                {...link}
                to={link.to}
                variant="navlink"
                className="px-4 transition-colors after:absolute after:bottom-1 after:left-0 after:block after:w-full after:border-transparent after:border-b-2 aria-[current]:after:border-accent"
              >
                {link.label}
              </Link>
            </div>
          ))}
        </div>
      </nav>
      {/* Left next to the menu button on phones, right on larger screens */}
      <ChampionshipSelect className="text-xl md:ml-auto md:text-base" />
      <div className="max-md:ml-auto">
        <ThemeSelect />
      </div>
    </HeaderFrame>
  );
}
