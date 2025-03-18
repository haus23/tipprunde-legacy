import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { VisuallyHidden } from 'react-aria';
import { useLocation } from 'react-router';

import { useAuthActions } from '@convex-dev/auth/react';
import { Authenticated, Unauthenticated } from 'convex/react';
import { DicesIcon, LogOutIcon, TableIcon, UsersIcon } from 'lucide-react';
import { useOptionalChampionship } from '#/utils/app/championship';
import { useChampionships } from '#/utils/app/championships';
import { useAuthStore } from '#/utils/auth';
import { Button } from '../(ui)/button/button';
import { Link, NavLink } from '../(ui)/link/link';
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
  { label: 'Tabelle', viewSegment: '', end: true, icon: TableIcon },
  { label: 'Spieler', viewSegment: 'spieler', end: false, icon: UsersIcon },
  { label: 'Spiele', viewSegment: 'spiel', end: false, icon: DicesIcon },
];

export function NavMobile() {
  const [open, setOpen] = useState(false);
  const { key } = useLocation();
  const { signOut } = useAuthActions();
  const logOut = useAuthStore((state) => state.logOut);

  const championship = useOptionalChampionship();
  const championships = useChampionships();

  const championshipRouteSegment =
    championship?.id &&
    (championship.id === championships[0].id ? '' : championship.id);

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

  async function handleLogout() {
    await signOut();
    logOut();
    setOpen(false);
  }

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
            <nav>
              <ul className="mb-2 flex flex-col font-medium">
                <li className="p-1">
                  <Link
                    to="/"
                    className="m-1 inline-flex items-center rounded-sm px-2 py-1"
                  >
                    <div className="flex items-center gap-x-2">
                      <Logo className="h-10 w-12" />
                      <h1 className="text-xl">runde.tips</h1>
                    </div>
                  </Link>
                </li>
                <li>
                  <hr className="mb-2 border-line" />
                </li>
                {navItems.map((item) => (
                  <li key={item.label} className="px-2">
                    <NavLink
                      className="my-1 flex w-full items-center gap-x-2 rounded-none border-transparent border-l-4 p-2 hover:border-gray-6 aria-[current=page]:border-accent-7"
                      to={`/${[championshipRouteSegment, item.viewSegment].filter(Boolean).join('/')}`}
                      end={item.end}
                    >
                      <item.icon />
                      <span className="">{item.label}</span>
                    </NavLink>
                  </li>
                ))}
                <li>
                  <hr className="my-2 border-line" />
                </li>
                <li className="px-2">
                  <Unauthenticated>
                    <NavLink
                      className="group my-1 block w-full px-1"
                      to={'/login'}
                    >
                      <span className="block border-transparent border-l-4 px-4 py-2 group-hover:border-gray-6 group-aria-[current=page]:border-accent-7">
                        Log In
                      </span>
                    </NavLink>
                  </Unauthenticated>
                  <Authenticated>
                    <Button
                      type="button"
                      onClick={handleLogout}
                      variant="toolbar"
                      className="flex w-full items-center justify-start gap-x-2 rounded-none border-transparent border-l-4 p-2 text-left hover:border-gray-6 hover:bg-transparent"
                    >
                      <LogOutIcon />
                      <span className="">Log Out</span>
                    </Button>
                  </Authenticated>
                </li>
                <li className="px-2">
                  <div className="flex items-center justify-between">
                    <span className="px-6 py-2">Hell-/Dunkel-Modus</span>
                    <DialogClose asChild>
                      <ThemeToggle />
                    </DialogClose>
                  </div>
                </li>
              </ul>
            </nav>
            <DialogClose asChild className="absolute top-4 right-2">
              <Button variant="toolbar">
                <XMarkIcon className="h-6" />
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
        <h2 className="font-semibold text-accent-foreground text-xl">
          {championship?.name || 'runde.tips'}
        </h2>
      </div>
      <ChampionshipSelect />
    </div>
  );
}
