import type { Championship } from '@haus23/tipprunde-model';
import { HouseIcon, UserIcon } from 'lucide-react';
import { Suspense, use } from 'react';
import { Link, NavLink, useSearchParams } from 'react-router';
import AppTitle from '#/components/app-title';
import { useChampionshipPlayers } from '#/hooks/current-data/use-championship-players';
import { useCurrentChampionship } from '#/hooks/current-data/use-current-championship';
import { roundParam } from '#/hooks/current-data/use-current-round';
import { useMatches } from '#/hooks/current-data/use-matches';
import { useRounds } from '#/hooks/current-data/use-rounds';
import { useProfile } from '#/hooks/use-profile';
import { ensureCurrentData } from '#/state/current-data-store';
import { cn } from '#/utils/cn';
import ChampionshipSwitcher from './app-shell.championship-switcher';
import {
  type ChampionshipPage,
  championshipPages,
} from './current-data/championship-pages';

function ChampionshipLink({
  championshipId,
  item,
}: {
  championshipId: Championship['id'];
  item: ChampionshipPage;
}) {
  const [searchParams] = useSearchParams();
  const round = item.keepsRound ? searchParams.get(roundParam) : null;
  const to = `/${championshipId}/${item.path}`;

  return (
    <NavLink
      to={round ? `${to}?${roundParam}=${round}` : to}
      className={({ isActive }) =>
        cn(
          isActive
            ? 'bg-gray-100 text-gray-900'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
          'group flex items-center rounded-md px-2 py-2 font-medium text-sm',
        )
      }
    >
      {({ isActive }) => (
        <>
          <item.icon
            className={cn(
              isActive
                ? 'text-gray-500'
                : 'text-gray-400 group-hover:text-gray-500',
              'mr-3 h-6 w-6 shrink-0',
            )}
            aria-hidden="true"
          />
          {item.label}
        </>
      )}
    </NavLink>
  );
}

function CurrentDataNavLinks({
  championship,
}: {
  championship: Championship | undefined;
}) {
  use(ensureCurrentData(championship?.id));
  const { rounds } = useRounds();
  const { championshipPlayers } = useChampionshipPlayers();
  const { matches } = useMatches();

  if (!championship) return null;

  return championshipPages
    .filter((item) => item.available(rounds, matches, championshipPlayers))
    .map((item) => (
      <ChampionshipLink
        key={item.label}
        championshipId={championship.id}
        item={item}
      />
    ));
}

const masterDataNavLinks: {
  to: string;
  label: string;
}[] = [
  {
    to: './stammdaten/turniere',
    label: 'Turniere',
  },
  {
    to: './stammdaten/spieler',
    label: 'Spieler',
  },
  {
    to: './stammdaten/teams',
    label: 'Teams',
  },
  {
    to: './stammdaten/ligen',
    label: 'Ligen',
  },
  {
    to: './stammdaten/regelwerke',
    label: 'Regelwerke',
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
        <div className="mt-5 flex flex-1 flex-col justify-between gap-y-4">
          <nav className="space-y-1 px-2" aria-label="Turnier">
            {championship && (
              <div className="pb-2">
                <ChampionshipSwitcher championship={championship} />
              </div>
            )}
            <NavLink
              to={championship ? `/${championship.id}` : '/'}
              end
              className={({ isActive }) =>
                cn(
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center rounded-md px-2 py-2 font-medium text-sm',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <HouseIcon
                    className={cn(
                      isActive
                        ? 'text-gray-500'
                        : 'text-gray-400 group-hover:text-gray-500',
                      'mr-3 h-6 w-6 shrink-0',
                    )}
                    aria-hidden="true"
                  />
                  Dashboard
                </>
              )}
            </NavLink>
            <Suspense fallback={null}>
              <CurrentDataNavLinks championship={championship} />
            </Suspense>
          </nav>
          <div>
            <span className="mb-2 block border-gray-200 border-b px-4 pb-2 font-medium text-gray-500">
              Stammdaten
            </span>
            <nav className="space-y-1 px-2">
              {masterDataNavLinks.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'flex items-center rounded-md px-2 py-2 font-medium text-sm',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex shrink-0 border-gray-200 border-t p-4">
        {profile && (
          <div className="flex items-center">
            <div>
              {profile.photoURL ? (
                <img
                  src={profile.photoURL}
                  aria-label="Profil-Bild"
                  className="inline-block h-9 w-9 rounded-full"
                />
              ) : (
                <UserIcon className="inline-block h-9 w-9 rounded-full bg-gray-200 p-1 text-gray-500" />
              )}
            </div>
            <div className="ml-3">
              <p className="font-medium text-gray-700 text-sm">
                {profile.displayName || profile.email}
              </p>
              <div className="font-medium text-gray-500 text-xs">
                <Link to="./profil" className="hover:text-gray-900">
                  Profil
                </Link>
                {' / '}
                <Link to="./logout" className="hover:text-gray-900">
                  Log Out
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
