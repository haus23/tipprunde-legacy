import * as Nav from '@radix-ui/react-navigation-menu';

import { useOptionalChampionship } from '#/utils/app/championship';
import { useChampionships } from '#/utils/app/championships';
import { Link, NavLink } from '../(ui)/atoms/link';
import { Logo } from '../brand/logo';
import { ChampionshipSelect } from '../commands/championship-select';
import { ThemeToggle } from './theme-toggle';
import { UserMenu } from './user-menu';

const navItems = [
  { label: 'Tabelle', viewSegment: '', end: true },
  { label: 'Spieler', viewSegment: 'spieler', end: false },
  { label: 'Spiele', viewSegment: 'spiel', end: false },
];

export function NavDesktop() {
  const championship = useOptionalChampionship();
  const championships = useChampionships();

  const championshipRouteSegment =
    championship?.id &&
    (championship.id === championships[0].id ? '' : championship.id);

  return (
    <div className="hidden items-center justify-between sm:flex">
      <Nav.Root>
        <Nav.List className="flex h-16 items-stretch">
          <Nav.Item className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-x-2 rounded-md pr-2 pl-1"
            >
              <Logo className="h-12 w-12" />
              <span className="text-xl">runde.tips</span>
            </Link>
          </Nav.Item>
          {navItems.map((item) => (
            <Nav.Item
              key={item.label}
              className="relative mx-1 flex items-center px-2 pt-1"
            >
              <NavLink
                to={`/${[championshipRouteSegment, item.viewSegment].filter(Boolean).join('/')}`}
                end={item.end}
                className="rounded-md p-2 after:absolute after:bottom-0 after:left-0 after:block after:w-full after:border-transparent after:border-b-2 aria-[current]:after:border-primary-line-hover! data-hovered:bg-neutral-hover data-hovered:after:border-line-hover"
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
        <UserMenu />
      </div>
    </div>
  );
}
