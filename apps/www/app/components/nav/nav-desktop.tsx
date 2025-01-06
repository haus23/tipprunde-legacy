import * as Nav from '@radix-ui/react-navigation-menu';

import { useOptionalChampionship } from '#/utils/app/championship';
import { Link, NavLink } from '../(ui)/atoms/link';
import { Logo } from '../brand/logo';
import { ChampionshipSelect } from '../commands/championship-select';
import { ThemeToggle } from './theme-toggle';

const navItems = [
  { label: 'Tabelle', viewSegment: '', end: true },
  { label: 'Spieler', viewSegment: 'spieler', end: false },
  { label: 'Spiele', viewSegment: 'spiel', end: false },
];

export function NavDesktop() {
  const championship = useOptionalChampionship();

  return (
    <div className="hidden items-center justify-between sm:flex">
      <Nav.Root>
        <Nav.List className="flex h-20 items-stretch">
          <Nav.Item className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-x-2 pl-1 pr-2 rounded-md"
            >
              <Logo className="h-12 w-12" />
              <span className="text-xl">runde.tips</span>
            </Link>
          </Nav.Item>
          {navItems.map((item) => (
            <Nav.Item
              key={item.label}
              className="flex items-center relative px-2 pt-1 mx-1"
            >
              <NavLink
                to={`/${[championship?.id, item.viewSegment].filter(Boolean).join('/')}`}
                end={item.end}
                className="p-2 rounded-md data-[hovered]:bg-neutral-hover after:border-b-2 after:border-transparent after:block after:absolute after:w-full after:bottom-0 after:left-0 aria-[current]:after:!border-primary-line-hover data-[hovered]:after:border-line-hover"
              >
                {item.label}
              </NavLink>
            </Nav.Item>
          ))}
        </Nav.List>
      </Nav.Root>
      <div className="flex gap-x-2">
        <ChampionshipSelect />
        <ThemeToggle />
      </div>
    </div>
  );
}
