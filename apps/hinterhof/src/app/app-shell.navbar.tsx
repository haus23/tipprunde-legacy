import {
  CalendarIcon,
  FolderIcon,
  HomeIcon,
  PencilSquareIcon,
  ScaleIcon,
  SquaresPlusIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import type { Championship, ChampionshipPlayer, Match, Round } from 'lib';
import type { ElementType } from 'react';
import { Link, NavLink } from 'react-router';
import { AppTitle, classNames } from 'ui-legacy';
import { useChampionshipPlayers } from '@/hooks/current-data/use-championship-players';
import { useCurrentChampionship } from '@/hooks/current-data/use-current-championship';
import { useMatches } from '@/hooks/current-data/use-matches';
import { useRounds } from '@/hooks/current-data/use-rounds';
import { useProfile } from '@/hooks/use-profile';

const championshipNavLinks: {
  to: string;
  icon: ElementType;
  label: string;
  visible: (
    championship: Championship | undefined,
    rounds: Round[],
    matches: Match[],
    players: ChampionshipPlayer[],
  ) => boolean;
}[] = [
  {
    to: './turnier',
    icon: FolderIcon,
    label: 'Turnier',
    visible: (championship) => !!championship,
  },
  {
    to: './spiele',
    icon: CalendarIcon,
    label: 'Spiele',
    visible: (_championship, rounds) => rounds.length > 0,
  },
  {
    to: './tipps',
    icon: PencilSquareIcon,
    label: 'Tipps',
    visible: (_championship, _rounds, matches, players) =>
      matches.length > 0 && players.length > 0,
  },
  {
    to: './ergebnisse',
    icon: ScaleIcon,
    label: 'Ergebnisse',
    visible: (_championship, _rounds, matches) => matches.length > 0,
  },
  {
    to: './zusatzpunkte',
    icon: SquaresPlusIcon,
    label: 'Zusatzpunkte',
    visible: (_championship, _rounds, _matches, players) => players.length > 0,
  },
];

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
  const { rounds } = useRounds();
  const { championshipPlayers } = useChampionshipPlayers();
  const { matches } = useMatches();

  return (
    <>
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <div className="px-2">
          <AppTitle />
        </div>
        <div className="mt-5 flex flex-1 flex-col justify-between gap-y-4">
          <nav className="space-y-1 px-2">
            <NavLink
              to="."
              end
              className={({ isActive }) =>
                classNames(
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center rounded-md px-2 py-2 font-medium text-sm',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <HomeIcon
                    className={classNames(
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
            {championshipNavLinks
              .filter((item) =>
                item.visible(
                  championship,
                  rounds,
                  matches,
                  championshipPlayers,
                ),
              )
              .map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    classNames(
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
                        className={classNames(
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
              ))}
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
                    classNames(
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
