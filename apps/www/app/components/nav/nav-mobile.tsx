import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import * as Nav from '@radix-ui/react-navigation-menu';
import { useEffect, useState } from 'react';
import { VisuallyHidden } from 'react-aria';
import { useLocation } from 'react-router';

import { useOptionalChampionship } from '#/utils/app/championship';
import { Button } from '../(ui)/atoms/button';
import { Link, NavLink } from '../(ui)/atoms/link';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '../(ui)/molecules/dialog';
import { Logo } from '../brand/logo';
import { ChampionshipSelect } from '../commands/championship-select';
import { ThemeToggle } from './theme-toggle';

const navItems = [
  { label: 'Tabelle', viewSegment: '', end: true },
  { label: 'Spieler', viewSegment: 'spieler', end: false },
  { label: 'Spiele', viewSegment: 'spiel', end: false },
];

export function NavMobile() {
  const [open, setOpen] = useState(false);
  const { key } = useLocation();

  const championship = useOptionalChampionship();

  useEffect(() => {
    function closeDialog(ev: MediaQueryListEvent) {
      ev.matches && setOpen(false);
    }

    const query = window.matchMedia('(min-width: 640px)');

    query.addEventListener('change', closeDialog);
    return () => query.removeEventListener('change', closeDialog);
  }, []);

  useEffect(() => {
    setOpen(key === ''); // Useless, but need to treat the linter
  }, [key]);

  return (
    <div className="flex h-16 items-center justify-between sm:hidden">
      <div className="flex items-center gap-x-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="toolbar" aria-label="Öffne Hauptmenü">
              <Bars3Icon className="h-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bottom-auto">
            <VisuallyHidden>
              <DialogTitle>Hauptmenü</DialogTitle>
            </VisuallyHidden>
            <VisuallyHidden>
              <DialogDescription>Das Hauptmenü der Webseite</DialogDescription>
            </VisuallyHidden>
            <Nav.Root orientation="vertical">
              <Nav.List className="mb-2 flex flex-col font-medium">
                <Nav.Item className="p-1">
                  <Nav.Link asChild>
                    <Link
                      to="/"
                      className="m-1 inline-flex items-center rounded px-2 py-1"
                    >
                      <div className="flex items-center gap-x-2">
                        <Logo className="h-10 w-12" />
                        <h1 className="text-xl">runde.tips</h1>
                      </div>
                    </Link>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <hr className="mb-2 border-line" />
                </Nav.Item>
                {navItems.map((item) => (
                  <Nav.Item key={item.label} className="px-2">
                    <Nav.Link
                      asChild
                      className="group my-1 block w-full rounded px-1 ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <NavLink
                        to={`/${[championship?.id, item.viewSegment].filter(Boolean).join('/')}`}
                        end={item.end}
                      >
                        <span className="block border-l-4 border-transparent px-4 py-2 group-hover:border-line-hover group-aria-[current=page]:border-primary-line-hover">
                          {item.label}
                        </span>
                      </NavLink>
                    </Nav.Link>
                  </Nav.Item>
                ))}
                <Nav.Item>
                  <hr className="mb-2 border-line" />
                </Nav.Item>
                <Nav.Item className="px-2">
                  <div className="flex items-center justify-between">
                    <span className="px-6 py-2">Hell-/Dunkel-Modus</span>
                    <DialogClose asChild>
                      <ThemeToggle />
                    </DialogClose>
                  </div>
                </Nav.Item>
              </Nav.List>
            </Nav.Root>
            <DialogClose className="absolute right-2 top-4 rounded p-1 ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <XMarkIcon className="h-6" />
            </DialogClose>
          </DialogContent>
        </Dialog>
        <h2 className="text-xl font-semibold text-accent-foreground">
          {championship?.name || 'runde.tips'}
        </h2>
      </div>
      <ChampionshipSelect />
    </div>
  );
}
