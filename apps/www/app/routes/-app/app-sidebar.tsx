import { getRouteApi } from '@tanstack/react-router';
import { FoldersIcon } from 'lucide-react';
import { useEffect } from 'react';
import { Dialog, Modal, ModalOverlay, Separator } from 'react-aria-components';

import { Logo } from '#/components/logo';
import { ThemeSelect } from '#/components/theme-select';
import { ActionProvider } from '#/components/ui/action-context';
import { Button } from '#/components/ui/button';
import { Link } from '#/components/ui/link';

import { useIsMobile } from '#/utils/misc';
import { useLayout } from './app-layout';
import { navLinks } from './nav-links';

const routeApi = getRouteApi('__root__');

export function AppSidebar() {
  const { isSidebarOpen, setSidebarOpen, setChampionshipSelectOpen } =
    useLayout();

  const isMobile = useIsMobile();
  useEffect(() => {
    if (!isMobile) setSidebarOpen(false);
  }, [isMobile, setSidebarOpen]);

  const { turnier } = routeApi.useSearch();

  return (
    <ModalOverlay
      isOpen={isSidebarOpen}
      onOpenChange={setSidebarOpen}
      isDismissable
      className="fixed inset-0 bg-background/50 backdrop-blur-[2px]"
    >
      <Modal className="fixed inset-y-0 left-0 w-64 bg-background shadow-gray-4 shadow-lg">
        <ActionProvider onAction={() => setSidebarOpen(false)}>
          <Dialog
            className="flex h-full flex-col justify-between py-2"
            aria-label="Sidebar-Navigation"
          >
            <nav className="flex flex-col gap-x-4">
              <div className="px-2">
                <Link to="/" className="flex items-center gap-x-2 pr-2 pl-1">
                  <Logo className="size-10" />
                  <span className="text-xl">runde.tips</span>
                </Link>
              </div>
              <Separator className="my-2" />
              {navLinks.map((link) => (
                <div key={link.to} className="px-2 py-1">
                  <Link
                    to={link.to}
                    search={{ turnier }}
                    variant="navlink"
                    className="flex items-center gap-x-2 p-2 aria-[current]:bg-accent-5 aria-[current]:text-gray-12"
                  >
                    <link.icon className="size-5" />
                    <span>{link.label}</span>
                  </Link>
                </div>
              ))}
            </nav>
            <div>
              <div className="flex items-center justify-between px-2">
                <span className="text-gray-11">Turnierauswahl</span>
                <Button
                  onPress={() => setChampionshipSelectOpen(true)}
                  variant="ghost"
                  aria-label="Turnier-Auswahl öffnen"
                >
                  <FoldersIcon className="size-5" />
                </Button>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between px-2">
                <span className="text-gray-11">Hell-/Dunkel-Modus</span>
                <ThemeSelect />
              </div>
            </div>
          </Dialog>
        </ActionProvider>
      </Modal>
    </ModalOverlay>
  );
}
