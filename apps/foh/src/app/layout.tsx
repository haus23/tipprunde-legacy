import { Fragment } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { AppTitle, classNames } from 'ui';

const navigation = [
  { name: 'Tabelle', route: '/tabelle' },
  { name: 'Spieler', route: '/spieler' },
  { name: 'Spiele', route: '/spiele' },
];

export default function Layout() {
  return (
    <div className="min-h-full">
      <Disclosure as="nav" className="bg-white shadow-sm">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="flex flex-shrink-0 items-center">
                    <Disclosure.Button as={Link} to="/">
                      <AppTitle />
                    </Disclosure.Button>
                  </div>
                  <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.route}
                        className={({ isActive }) =>
                          classNames(
                            isActive
                              ? 'border-indigo-500 text-gray-900'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                            'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                          )
                        }
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
                <div className="-mr-2 flex items-center sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pt-2 pb-3">
                {navigation.map((item) => (
                  <Disclosure.Button as={Fragment} key={item.name}>
                    <NavLink
                      to={item.route}
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                            : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                          'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
                        )
                      }
                    >
                      {item.name}
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
