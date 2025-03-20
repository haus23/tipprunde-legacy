import { Dialog, Modal, ModalOverlay } from 'react-aria-components';

import { useLayout } from '#/routes/-app/app-layout';

import { ActionProvider } from './ui/action-context';

const styles = 'ring-1 ring-gray-6 focus:outline-hidden';

export function ChampionshipSelect() {
  const { isChampionshipSelectOpen, setChampionshipSelectOpen } = useLayout();

  return (
    <ModalOverlay
      isOpen={isChampionshipSelectOpen}
      onOpenChange={setChampionshipSelectOpen}
      isDismissable
      className="fixed inset-0 bg-background/50 backdrop-blur-[2px]"
    >
      <Modal className="fixed inset-4 bottom-auto mx-auto max-w-xl rounded-md bg-background shadow-gray-4 shadow-lg">
        <ActionProvider onAction={() => setChampionshipSelectOpen(false)}>
          <Dialog
            className="flex h-full flex-col justify-between py-2"
            aria-label="Turnier-Auswahl"
          >
            <p>Turnier-Suche</p>
          </Dialog>
        </ActionProvider>
      </Modal>
    </ModalOverlay>
  );
}
