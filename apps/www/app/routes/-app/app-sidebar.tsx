import { Dialog, Modal, ModalOverlay, Separator } from 'react-aria-components';

import { Logo } from '#/components/logo';
import { ActionProvider } from '#/components/ui/action-context';
import { Link } from '#/components/ui/link';
import { useLayout } from './app-layout';
import { navLinks } from './nav-links';
import { ThemeSelect } from './theme-select';

export function AppSidebar() {
  const { isSidebarOpen, setSidebarOpen } = useLayout();

  if (!isSidebarOpen) return null;

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
                    className="flex items-center gap-x-2 p-2 text-gray-11 hover:bg-accent-4 hover:text-gray-12 aria-[current]:bg-accent-5 aria-[current]:text-gray-12"
                  >
                    <link.icon className="size-5" />
                    <span>{link.label}</span>
                  </Link>
                </div>
              ))}
            </nav>
            <div>
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
