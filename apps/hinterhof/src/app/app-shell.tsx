import { Dialog } from '@base-ui/react/dialog';
import { MenuIcon, XIcon } from 'lucide-react';
import { use, useEffect, useState } from 'react';
import { Outlet, useLocation, useMatches, useParams } from 'react-router';
import { useCurrentChampionship } from '#/hooks/current-data/use-current-championship';
import { ensureMasterData } from '#/state/master-data-store';
import { focusRing, focusRingOnDark } from '#/styles/focus';
import { cn } from '#/utils/cn';
import AppShellNavbar from './app-shell.navbar';

// What the page belongs to: the championship on championship pages, else
// the `context` of the route (e.g. master data), else the app name.
function useContextTitle() {
  const { turnier } = useParams();
  const { currentChampionship } = useCurrentChampionship();
  const matches = useMatches();

  if (turnier && currentChampionship) return currentChampionship.name;
  const context = matches
    .map(({ handle }) => (handle as { context?: string } | undefined)?.context)
    .findLast(Boolean);
  return context ?? 'Hinterhof';
}

export default function AppShell() {
  use(ensureMasterData());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const contextTitle = useContextTitle();
  useEffect(() => {
    setSidebarOpen(location.key === ''); // Useless, but need to treat the linter
  }, [location]);

  return (
    <>
      {/* Mobile slide out navbar. The root only wraps the sidebar, so dialogs
          of the pages are not nested in it. */}
      <Dialog.Root open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-40 bg-overlay transition-opacity duration-300 ease-linear data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none md:hidden" />
          <Dialog.Popup
            className="fixed inset-y-0 left-0 z-40 flex w-[calc(100%-3.5rem)] max-w-xs flex-col bg-sidebar text-sidebar-foreground shadow-xl transition-transform duration-300 ease-in-out data-ending-style:-translate-x-full data-starting-style:-translate-x-full motion-reduce:transition-none md:hidden"
            aria-label="Navigation"
          >
            <div className="absolute top-0 right-0 translate-x-full pt-2 pl-1">
              <Dialog.Close
                className={cn(
                  focusRingOnDark,
                  'flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/10',
                )}
              >
                <span className="sr-only">Navigation schließen</span>
                <XIcon className="h-6 w-6" aria-hidden="true" />
              </Dialog.Close>
            </div>
            <AppShellNavbar />
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
      {/* Static desktop navbar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-sidebar-border border-r bg-sidebar text-sidebar-foreground">
          <AppShellNavbar />
        </div>
      </div>
      {/* Content with header */}
      <div className="flex flex-col md:pl-64">
        {/* Mobile app bar: menu button and the context of the page */}
        <div className="sticky top-0 z-20 flex h-(--app-bar-height) items-center gap-x-3 border-sidebar-border border-b bg-background px-4 sm:px-6 md:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={sidebarOpen}
            className={cn(
              focusRing,
              '-ml-1.5 inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground',
            )}
          >
            <span className="sr-only">Navigation öffnen</span>
            <MenuIcon className="size-6" aria-hidden="true" />
          </button>
          <p className="truncate font-semibold">{contextTitle}</p>
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
    </>
  );
}
