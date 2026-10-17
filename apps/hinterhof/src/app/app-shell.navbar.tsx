import type { Championship } from '@haus23/tipprunde-model';
import {
  LayersIcon,
  LogOutIcon,
  MonitorSmartphoneIcon,
  ScrollTextIcon,
  ShieldIcon,
  TrophyIcon,
  UserIcon,
  UsersIcon,
} from 'lucide-react';
import { type ElementType, Suspense, use } from 'react';
import { Link, NavLink, useSearchParams } from 'react-router';
import AppTitle from '#/components/app-title';
import { useChampionshipPlayers } from '#/hooks/current-data/use-championship-players';
import { useCurrentChampionship } from '#/hooks/current-data/use-current-championship';
import { roundParam } from '#/hooks/current-data/use-current-round';
import { useMatches } from '#/hooks/current-data/use-matches';
import { useRounds } from '#/hooks/current-data/use-rounds';
import { useProfile } from '#/hooks/use-profile';
import { ensureCurrentData } from '#/state/current-data-store';
import { focusRingInset } from '#/styles/focus';
import { cn } from '#/utils/cn';
import ChampionshipSwitcher from './app-shell.championship-switcher';
import { championshipPages } from './current-data/championship-pages';

// One look for every navigation entry: active, inactive, hover and focus.
function NavItem({
  end,
  icon: Icon,
  label,
  to,
}: {
  end?: boolean;
  icon: ElementType;
  label: string;
  to: string;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          focusRingInset,
          'group flex items-center gap-x-3 rounded-md px-2 py-2 font-medium text-sm transition-colors motion-reduce:transition-none',
          isActive
            ? 'bg-sidebar-primary text-sidebar-primary-foreground'
            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        )
      }
    >
      <Icon
        className="size-6 shrink-0 opacity-60 group-hover:opacity-80 group-aria-[current=page]:opacity-80"
        aria-hidden="true"
      />
      {label}
    </NavLink>
  );
}

function ChampionshipNavItems({
  championship,
}: {
  championship: Championship;
}) {
  use(ensureCurrentData(championship.id));
  const { rounds } = useRounds();
  const { championshipPlayers } = useChampionshipPlayers();
  const { matches } = useMatches();
  const [searchParams] = useSearchParams();
  const round = searchParams.get(roundParam);

  return championshipPages
    .filter((page) => page.available(rounds, matches, championshipPlayers))
    .map((page) => {
      const to = `/${championship.id}${page.path && `/${page.path}`}`;
      return (
        <NavItem
          key={page.path}
          end={page.path === ''}
          to={page.keepsRound && round ? `${to}?${roundParam}=${round}` : to}
          icon={page.icon}
          label={page.label}
        />
      );
    });
}

const masterDataItems = [
  { to: '/stammdaten/turniere', icon: TrophyIcon, label: 'Turniere' },
  { to: '/stammdaten/spieler', icon: UsersIcon, label: 'Spieler' },
  { to: '/stammdaten/teams', icon: ShieldIcon, label: 'Teams' },
  { to: '/stammdaten/ligen', icon: LayersIcon, label: 'Ligen' },
  { to: '/stammdaten/regelwerke', icon: ScrollTextIcon, label: 'Regelwerke' },
];

const analyticsItems = [
  {
    to: '/auswertung/geraete',
    icon: MonitorSmartphoneIcon,
    label: 'Geräte',
  },
];

export default function AppShellNavbar() {
  const { profile } = useProfile();
  const { currentChampionship: championship } = useCurrentChampionship();

  return (
    <>
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <div className="px-2">
          <AppTitle />
        </div>
        <div className="mt-5 flex flex-1 flex-col justify-between gap-y-6">
          <nav className="space-y-1 px-2" aria-label="Turnier">
            {championship && (
              <div className="pb-2">
                <ChampionshipSwitcher championship={championship} />
              </div>
            )}
            {championship && (
              <Suspense fallback={null}>
                <ChampionshipNavItems championship={championship} />
              </Suspense>
            )}
          </nav>
          <div className="space-y-6">
            <nav className="px-2" aria-labelledby="master-data-heading">
              <h2
                id="master-data-heading"
                className="mb-2 border-sidebar-border border-b px-2 pb-2 font-medium text-sidebar-foreground/70 text-xs uppercase tracking-wide"
              >
                Stammdaten
              </h2>
              <div className="space-y-1">
                {masterDataItems.map((item) => (
                  <NavItem key={item.to} {...item} />
                ))}
              </div>
            </nav>
            <nav className="px-2" aria-labelledby="analytics-heading">
              <h2
                id="analytics-heading"
                className="mb-2 border-sidebar-border border-b px-2 pb-2 font-medium text-sidebar-foreground/70 text-xs uppercase tracking-wide"
              >
                Auswertung
              </h2>
              <div className="space-y-1">
                {analyticsItems.map((item) => (
                  <NavItem key={item.to} {...item} />
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>
      {profile && (
        <div className="flex shrink-0 items-center gap-x-1 border-sidebar-border border-t p-2">
          <NavLink
            to="/profil"
            className={({ isActive }) =>
              cn(
                focusRingInset,
                'flex min-w-0 grow items-center gap-x-3 rounded-md p-2 transition-colors motion-reduce:transition-none',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              )
            }
          >
            {profile.photoURL ? (
              <img
                src={profile.photoURL}
                alt=""
                className="size-9 shrink-0 rounded-full"
              />
            ) : (
              <UserIcon
                className="size-9 shrink-0 rounded-full bg-sidebar-primary p-1.5"
                aria-hidden="true"
              />
            )}
            <span className="min-w-0">
              <span className="block truncate font-medium text-sm">
                {profile.displayName || profile.email}
              </span>
              <span className="block text-xs opacity-70">Profil</span>
            </span>
          </NavLink>
          <Link
            to="/logout"
            aria-label="Abmelden"
            title="Abmelden"
            className={cn(
              focusRingInset,
              'flex size-10 shrink-0 items-center justify-center rounded-md text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground motion-reduce:transition-none',
            )}
          >
            <LogOutIcon className="size-5" aria-hidden="true" />
          </Link>
        </div>
      )}
    </>
  );
}
