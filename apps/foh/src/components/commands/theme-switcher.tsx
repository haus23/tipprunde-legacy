import {
  ElementType,
  Fragment,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { Menu, Transition } from '@headlessui/react';

import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/24/outline';
import { classNames } from '@/utils/class-names';
import { darkModeQuery, setDarkClass } from '@/utils/dark-mode';

// DOM Handling

const themeNavigation: {
  theme: string;
  icon: ElementType;
}[] = [
  { theme: 'Light', icon: SunIcon },
  { theme: 'Dark', icon: MoonIcon },
  { theme: 'System', icon: ComputerDesktopIcon },
];

export default function ThemeSwitcher() {
  const [theme, setTheme] = useReducer((current: string, next: string) => {
    localStorage.setItem('theme', next);
    return next;
  }, localStorage.getItem('theme') || 'system');

  const [isSystemDark, setSystemDark] = useState(darkModeQuery.matches);

  useEffect(() => {
    const darkModeListener = (ev: MediaQueryListEvent) =>
      setSystemDark(ev.matches);
    darkModeQuery.addEventListener('change', darkModeListener);
    return () => darkModeQuery.removeEventListener('change', darkModeListener);
  }, []);

  const darkMode = useMemo(
    () => (theme === 'system' && isSystemDark) || theme === 'dark',
    [theme, isSystemDark]
  );

  useEffect(() => {
    setDarkClass(darkMode);
  }, [darkMode]);

  return (
    <Menu as="div" className="relative flex">
      <Menu.Button className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 mr-1">
        {darkMode ? (
          <MoonIcon className="h-5 w-5" />
        ) : (
          <SunIcon className="h-5 w-5 text-orange-500" />
        )}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 top-10 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-50">
          {themeNavigation.map((item) => (
            <Menu.Item key={item.theme}>
              {({ active }) => {
                const targetTheme = item.theme.toLowerCase();
                const current = theme === targetTheme;
                const CustomIcon = item.icon;
                return (
                  <button
                    onClick={() => setTheme(targetTheme)}
                    className={classNames(
                      active
                        ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-50'
                        : current
                        ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
                        : 'text-gray-500 dark:text-gray-200',
                      'flex w-full items-center px-4 py-2 text-sm font-medium'
                    )}
                  >
                    <CustomIcon className="h-6 w-6" />
                    <span className="ml-2">{item.theme}</span>
                  </button>
                );
              }}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
