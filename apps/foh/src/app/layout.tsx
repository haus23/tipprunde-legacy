import { Fragment } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';

import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

import Logo from '@/components/brand/logo';
import ChampionshipSwitcher from '@/components/commands/championship-switcher';
import ThemeSwitcher from '@/components/commands/theme-switcher';

import { classNames } from '@/utils/class-names';
import { useChampionships } from '@/hooks/use-championships';
import { useCurrentChampionship } from '@/hooks/use-current-championship';

const navigation = [
  // v1: Uncomment the below lines
  // { name: 'Turnier', route: '.' },
  { name: 'Tabelle', route: '../tabelle' },
  // { name: 'Spieler', route: '../spieler' },
  // { name: 'Spiele', route: '../spiele' },
];

export default function Layout() {
  const championships = useChampionships();
  const currentChampionship = useCurrentChampionship();

  return (
    <div className="min-h-full">
      <Disclosure
        as="nav"
        className="px-2 sm:px-4 py-2.5 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
      >
        {({ open, close }) => (
          <>
            <div className="flex flex-wrap justify-between items-center">
              <Link
                onClick={() => close()}
                to={currentChampionship ? '/tabelle' : '/'}
                className="flex items-center dark:text-white  focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg py-1 pr-2"
              >
                <Logo className="mr-2 h-8 sm:h-10" />
                <h1 className="self-center text-xl font-semibold whitespace-nowrap">
                  runde.tips
                </h1>
              </Link>
              <div className="flex justify-between items-center">
                {currentChampionship && (
                  <div className="hidden sm:flex justify-between items-center w-auto">
                    <ul className="flex p-4 space-x-2  font-medium">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <NavLink
                            to={item.route}
                            relative="path"
                            end
                            className={({ isActive }) =>
                              classNames(
                                isActive
                                  ? 'text-gray-900 dark:text-white'
                                  : 'text-gray-500 dark:text-gray-400',
                                'hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg py-2.5'
                              )
                            }
                          >
                            {({ isActive }) => (
                              <span
                                className={classNames(
                                  '-mt-1 pb-[1.6rem] px-4 border-b-2 border-transparent hover:border-gray-400',
                                  isActive &&
                                    'border-blue-500 hover:border-blue-500'
                                )}
                              >
                                {item.name}
                              </span>
                            )}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {championships && (
                  <div className="flex items-center space-x-1">
                    {championships.length > 1 && <ChampionshipSwitcher />}
                    <ThemeSwitcher />
                    {currentChampionship && (
                      <div className="flex items-center sm:hidden">
                        <Disclosure.Button className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 mr-1">
                          <span className="sr-only">Open main menu</span>
                          {open ? (
                            <XMarkIcon
                              className="block h-5 w-5"
                              aria-hidden="true"
                            />
                          ) : (
                            <Bars3Icon
                              className="block h-5 w-5"
                              aria-hidden="true"
                            />
                          )}
                        </Disclosure.Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pt-4 pb-2">
                {navigation.map((item) => (
                  <Disclosure.Button as={Fragment} key={item.name}>
                    <NavLink
                      to={item.route}
                      end
                      className="block text-base font-medium"
                    >
                      {({ isActive }) => (
                        <span
                          className={classNames(
                            isActive
                              ? 'bg-blue-50 dark:bg-blue-900 border-blue-500 text-gray-900 dark:text-white'
                              : 'border-transparent text-gray-500 hover:border-gray-300 dark:hover:border-gray-400 hover:text-gray-900 dark:hover:text-white',
                            'block pl-3 pr-4 py-2 border-l-4'
                          )}
                        >
                          {item.name}
                        </span>
                      )}
                    </NavLink>
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <main className="py-10">
        <Outlet />
      </main>
    </div>
  );
}
