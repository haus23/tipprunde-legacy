import { ElementType } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  FolderIcon,
  CalendarIcon,
  UserIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';

import { useProfile } from '@/hooks/use-profile';
import { classNames } from '@/utils/class-names';
import AppTitle from './app-title';
import { Championship } from 'lib';
import { useCurrentChampionship } from '@/hooks/use-current-championship';

const championshipNavLinks: {
  to: string;
  icon: ElementType;
  label: string;
  visible: (championship: Championship | undefined) => boolean;
}[] = [
  {
    to: './turnier',
    icon: FolderIcon,
    label: 'Turnier',
    visible: (championship) => !!championship,
  },
  {
    to: './mitspieler',
    icon: UsersIcon,
    label: 'Mitspieler',
    visible: (championship) => !!championship,
  },
  {
    to: './spiele',
    icon: CalendarIcon,
    label: 'Spiele',
    visible: (championship) => !!championship,
  },
  {
    to: './tipps',
    icon: PencilSquareIcon,
    label: 'Tipps',
    visible: (championship) => !!championship,
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

export default function AppNavbar() {
  const { profile } = useProfile();
  const { currentChampionship: championship } = useCurrentChampionship();

  return (
    <>
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <AppTitle />
        <div className="mt-5 flex-1 flex flex-col justify-between gap-y-4">
          <nav className="space-y-1 px-2">
            <NavLink
              to="."
              end
              className={({ isActive }) =>
                classNames(
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
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
                      'mr-3 flex-shrink-0 h-6 w-6'
                    )}
                    aria-hidden="true"
                  />
                  Dashboard
                </>
              )}
            </NavLink>
            {championshipNavLinks
              .filter((item) => item.visible(championship))
              .map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    classNames(
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
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
                          'mr-3 flex-shrink-0 h-6 w-6'
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
            <span className="block px-4 font-medium text-gray-500 pb-2 mb-2 border-b border-gray-200">
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
                      'flex items-center px-2 py-2 text-sm font-medium rounded-md'
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
      <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
        {profile && (
          <div className="flex items-center">
            <div>
              {profile.photoURL ? (
                <img
                  src={profile.photoURL}
                  className="inline-block h-9 w-9 rounded-full"
                />
              ) : (
                <UserIcon className="inline-block h-9 w-9 rounded-full bg-gray-200 p-1 text-gray-500" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {profile.displayName || profile.email}
              </p>
              <div className="text-xs font-medium text-gray-500">
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
