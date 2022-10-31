import { Fragment } from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { AppTitle, classNames } from 'ui';
import ErrorPage from './error/page';
import ChampionshipSwitcher from '@/components/championship-switcher';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useChampionships } from '@/hooks/use-championships';
import { useCurrentChampionship } from '@/hooks/use-current-championship';

const navigation = [
  { name: 'Turnier', route: '.' },
  { name: 'Tabelle', route: 'tabelle' },
  { name: 'Spieler', route: 'spieler' },
  { name: 'Spiele', route: 'spiele' },
];

export default function Layout() {
  const championships = useChampionships();
  const currentChampionship = useCurrentChampionship();

  return (
    <div className="min-h-full">
      <Disclosure as="nav" className="bg-white shadow-sm">
        {({ open, close }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="flex flex-shrink-0 items-center">
                    <Link onClick={() => close()} to="/turnier">
                      <AppTitle />
                    </Link>
                  </div>
                  {currentChampionship && (
                    <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-4">
                      {navigation.map((item) => (
                        <NavLink
                          key={item.name}
                          to={item.route}
                          end
                          className="inline-flex pt-1 text-sm font-medium items-stretch"
                        >
                          {({ isActive }) => (
                            <span
                              className={classNames(
                                isActive
                                  ? 'border-indigo-500 text-gray-900'
                                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                'inline-flex items-center px-2 border-b-2'
                              )}
                            >
                              {item.name}
                            </span>
                          )}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
                {championships && (
                  <div className="flex items-center space-x-2">
                    {championships.length > 1 && <ChampionshipSwitcher />}
                    {currentChampionship && (
                      <div className="-mr-2 flex items-center sm:hidden">
                        <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          <span className="sr-only">Open main menu</span>
                          {open ? (
                            <XMarkIcon
                              className="block h-6 w-6"
                              aria-hidden="true"
                            />
                          ) : (
                            <Bars3Icon
                              className="block h-6 w-6"
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
              <div className="space-y-1 pt-2 pb-3">
                {navigation.map((item) => (
                  <Disclosure.Button
                    as={Fragment}
                    key={item.name}
                    refName="_ref"
                  >
                    <NavLink
                      to={item.route}
                      end
                      className="block  text-base font-medium"
                    >
                      {({ isActive }) => (
                        <span
                          className={classNames(
                            isActive
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                              : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
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
        {typeof currentChampionship !== 'undefined' ? (
          <Outlet />
        ) : (
          <ErrorPage />
        )}
      </main>
    </div>
  );
}
