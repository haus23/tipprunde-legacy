import { Fragment } from 'react';
import { Link, LoaderFn, Outlet, useMatch } from '@tanstack/react-location';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { AppTitle, classNames } from 'ui';
import { LocationGenerics } from '@/app.routes';
import { Championship, collection, filter, orderByDesc } from 'lib';
import ErrorPage from './error/page';
import ChampionshipSwitcher from '@/components/championship-switcher';

const navigation = [
  { name: 'Turnier', route: '.' },
  { name: 'Tabelle', route: 'tabelle' },
  { name: 'Spieler', route: 'spieler' },
  { name: 'Spiele', route: 'spiele' },
];

export const rootLoader: LoaderFn<LocationGenerics> = async ({
  params: { championshipId },
}) => {
  const championships = await collection<Championship>(
    'championships',
    filter('published', '==', true),
    orderByDesc('nr')
  ).get();

  const currentChampionship =
    championshipId === 'turnier'
      ? championships.at(0) || null
      : championships.find((c) => c.id === championshipId);

  // Todo: Check updates for error bug.
  // See: https://github.com/TanStack/router/issues/255
  // if (typeof currentChampionship === 'undefined') {
  //   throw new Error('Unbekanntes Turnier.');
  // }

  return {
    championships,
    currentChampionship,
  };
};

export default function Layout() {
  const {
    data: { championships, currentChampionship },
  } = useMatch<LocationGenerics>();

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
                    <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.route}
                          activeOptions={{ exact: true }}
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
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                {championships && championships.length > 1 && (
                  <ChampionshipSwitcher />
                )}
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
            </div>
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pt-2 pb-3">
                {navigation.map((item) => (
                  <Disclosure.Button
                    as={Fragment}
                    key={item.name}
                    refName="_ref"
                  >
                    <Link
                      to={item.route}
                      activeOptions={{ exact: true }}
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
                    </Link>
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
