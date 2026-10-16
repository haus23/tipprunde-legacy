import { Dialog } from '@base-ui/react/dialog';
import { useEffect } from 'react';

import { Logo } from '#/components/logo';
import { ActionProvider } from '#/components/ui/action-context';
import { Link } from '#/components/ui/link';

import { useChampionship } from '#/utils/app/championship';
import { useIsMobile } from '#/utils/misc';
import { useAppShell } from './app-shell';
import { navLinks } from './nav-links';

export function AppSidebar() {
  const championship = useChampionship();
  const { isSidebarOpen, setSidebarOpen } = useAppShell();

  const isMobile = useIsMobile();
  useEffect(() => {
    if (!isMobile) setSidebarOpen(false);
  }, [isMobile, setSidebarOpen]);

  return (
    <Dialog.Root open={isSidebarOpen} onOpenChange={setSidebarOpen}>
      <Dialog.Portal>
        <Dialog.Backdrop className="absolute inset-0 bg-background/50 backdrop-blur-[2px] transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none" />
        <Dialog.Popup
          aria-label="Menü"
          className="fixed inset-y-0 left-0 flex w-64 flex-col bg-background py-2 font-medium shadow-elevation shadow-lg outline-hidden transition-transform duration-200 data-ending-style:-translate-x-full data-starting-style:-translate-x-full motion-reduce:transition-none"
        >
          <ActionProvider onAction={() => setSidebarOpen(false)}>
            <nav className="flex flex-col gap-x-4">
              <div className="px-2">
                <Link
                  to="/"
                  variant="plain"
                  className="flex items-center gap-x-2 py-0 pl-1"
                >
                  <Logo className="size-10" />
                  <span className="text-xl">runde.tips</span>
                </Link>
              </div>
              <hr className="my-2" />
              {navLinks(championship.id).map((link) => (
                <div key={link.to} className="px-2 py-1">
                  <Link
                    to={link.to}
                    params={link.params}
                    activeOptions={link.activeOptions}
                    variant="navlink"
                    className="flex items-center gap-x-2 aria-[current]:bg-selected aria-[current]:text-foreground"
                  >
                    <link.icon className="size-5" aria-hidden="true" />
                    <span>{link.label}</span>
                  </Link>
                </div>
              ))}
            </nav>
          </ActionProvider>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
