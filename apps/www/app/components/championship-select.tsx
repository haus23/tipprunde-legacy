import { useQuery } from '@tanstack/react-query';
import {
  Autocomplete,
  Dialog,
  Input,
  Modal,
  ModalOverlay,
  SearchField,
  useFilter,
} from 'react-aria-components';

import { useLayout } from '#/routes/-app/app-layout';
import { championshipsQuery } from '#/unterbau/queries';

import { useNavigate } from '@tanstack/react-router';
import { ActionProvider } from './ui/action-context';
import { ListBox, ListBoxItem } from './ui/listbox';

const styles = 'ring-1 ring-gray-6 focus:outline-hidden';

export function ChampionshipSelect() {
  const { isChampionshipSelectOpen, setChampionshipSelectOpen } = useLayout();
  const navigate = useNavigate();
  const { data: championships } = useQuery({
    ...championshipsQuery(),
    initialData: [],
  });

  const { contains } = useFilter({ sensitivity: 'base' });

  function handleAction(championshipId: string) {
    setChampionshipSelectOpen(false);
    navigate({ to: '/', search: { turnier: championshipId } });
  }

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
            <Autocomplete filter={contains}>
              <SearchField aria-label="Turniere durchsuchen">
                <Input placeholder="Turnier" />
              </SearchField>
              <ListBox items={championships}>
                {(championship) => (
                  <ListBoxItem
                    id={championship.id}
                    textValue={championship.name}
                    onAction={() => handleAction(championship.id)}
                  >
                    <span>{championship.name}</span>
                  </ListBoxItem>
                )}
              </ListBox>
            </Autocomplete>
          </Dialog>
        </ActionProvider>
      </Modal>
    </ModalOverlay>
  );
}
