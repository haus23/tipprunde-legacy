import { ElementType } from 'react';
import {
  HomeIcon,
  UsersIcon,
  FolderIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

import { useAuth } from '@/hooks/use-auth';
import { classNames } from '@/utils/class-names';
import AppTitle from './app-title';
import { NavLink } from 'react-router-dom';

const navLinks: {
  to: string;
  icon: ElementType;
  label: string;
  visible: () => boolean;
}[] = [
  {
    to: '.',
    icon: HomeIcon,
    label: 'Dashboard',
    visible: () => true,
  },
  {
    to: './turnier',
    icon: FolderIcon,
    label: 'Turnier',
    visible: () => true,
  },
  {
    to: './mitspieler',
    icon: UsersIcon,
    label: 'Mitspieler',
    visible: () => true,
  },
  {
    to: './spiele',
    icon: CalendarIcon,
    label: 'Spiele',
    visible: () => true,
  },
];

export default function AppNavbar() {
  const { signOut } = useAuth();
  return (
    <>
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <AppTitle />
        <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
          {navLinks.map((item) => (
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
      </div>
      <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
        <a
          onClick={signOut}
          href="#"
          className="group block w-full flex-shrink-0"
        >
          <div className="flex items-center">
            <div>
              <img
                className="inline-block h-9 w-9 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                Tom Cook
              </p>
              <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                View profile
              </p>
            </div>
          </div>
        </a>
      </div>
    </>
  );
}
