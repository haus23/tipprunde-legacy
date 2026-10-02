import { Dialog } from '@base-ui/react/dialog';
import { MenuIcon, XIcon } from 'lucide-react';
import { use, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';

import { ensureMasterData } from '#/state/master-data-store';
import AppShellNavbar from './app-shell.navbar';

export default function AppShell() {
  use(ensureMasterData());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setSidebarOpen(location.key === ''); // Useless, but need to treat the linter
  }, [location]);

  return (
    <Dialog.Root open={sidebarOpen} onOpenChange={setSidebarOpen}>
      {/* Mobile slide out navbar */}
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-overlay transition-opacity duration-300 ease-linear data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none md:hidden" />
        <Dialog.Popup
          className="fixed inset-y-0 left-0 z-40 flex w-[calc(100%-3.5rem)] max-w-xs flex-col bg-sidebar text-sidebar-foreground shadow-xl transition-transform duration-300 ease-in-out data-ending-style:-translate-x-full data-starting-style:-translate-x-full motion-reduce:transition-none md:hidden"
          aria-label="Navigation"
        >
          <div className="absolute top-0 right-0 translate-x-full pt-2 pl-1">
            <Dialog.Close className="flex h-10 w-10 items-center justify-center rounded-full text-white outline-hidden hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset">
              <span className="sr-only">Navigation schließen</span>
              <XIcon className="h-6 w-6" aria-hidden="true" />
            </Dialog.Close>
          </div>
          <AppShellNavbar />
        </Dialog.Popup>
      </Dialog.Portal>
      {/* Static desktop navbar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-gray-200 border-r bg-white">
          <AppShellNavbar />
        </div>
      </div>
      {/* Content with header */}
      <div className="flex flex-col md:pl-64">
        {/* Toggle menu button */}
        <div className="sticky top-0 z-10 bg-background pt-1 pl-1 sm:pt-3 sm:pl-3 md:hidden">
          <Dialog.Trigger className="-mt-0.5 -ml-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-inset">
            <span className="sr-only">Navigation öffnen</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </Dialog.Trigger>
        </div>

        {/* Content */}
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <div className="py-4">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </Dialog.Root>
  );
}
