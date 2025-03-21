import { useQuery } from '@tanstack/react-query';
import {
  Autocomplete,
  Dialog,
  Input,
  Modal,
  ModalOverlay,
  SearchField,
  type Selection,
  Separator,
  useFilter,
} from 'react-aria-components';

import { useLayout } from '#/routes/-app/app-layout';
import { championshipsQuery } from '#/unterbau/queries';

import { useLoaderData, useNavigate } from '@tanstack/react-router';
import { CheckIcon } from 'lucide-react';
import { ActionProvider } from './ui/action-context';
import { ListBox, ListBoxItem } from './ui/listbox';

export function ChampionshipSelect() {
  const { isChampionshipSelectOpen, setChampionshipSelectOpen } = useLayout();
  const navigate = useNavigate();
  const { data: championships } = useQuery({
    ...championshipsQuery(),
    initialData: [],
  });
  const { championship } = useLoaderData({ from: '__root__' });
  const selectedChampionship = new Set([championship.id]);

  const { contains } = useFilter({ sensitivity: 'base' });

  function handleSelection(keys: Selection) {
    const key = keys !== 'all' && [...keys][0];
    setChampionshipSelectOpen(false);
    if (key) {
      const turnier =
        String(key) === championships[0].id ? undefined : String(key);
      navigate({ to: '/', search: { turnier } });
    }
  }

  return (
    <ModalOverlay
      isOpen={isChampionshipSelectOpen}
      onOpenChange={setChampionshipSelectOpen}
      isDismissable
      className="fixed inset-0 bg-background/50 backdrop-blur-[2px]"
    >
      <Modal className="fixed inset-4 bottom-auto mx-auto max-w-lg rounded-md bg-background shadow-gray-4 shadow-md ring-1 ring-gray-6 dark:shadow-none">
        <ActionProvider onAction={() => setChampionshipSelectOpen(false)}>
          <Dialog
            className="flex h-full flex-col justify-between py-2 font-medium"
            aria-label="Turnier-Auswahl"
          >
            <Autocomplete filter={contains}>
              <SearchField aria-label="Turniere durchsuchen">
                <Input
                  autoFocus
                  placeholder="Turnier"
                  className="w-full px-6 py-2 outline-hidden"
                />
              </SearchField>
              <Separator className="mt-2" />
              <ListBox
                items={championships}
                selectionMode="single"
                defaultSelectedKeys={selectedChampionship}
                onSelectionChange={handleSelection}
                className="mt-2 max-h-[70svh] overflow-y-auto"
              >
                {(championship) => (
                  <ListBoxItem
                    id={championship.id}
                    textValue={championship.name}
                    className="flex items-center justify-between aria-selected:text-accent-11"
                  >
                    {({ isSelected }) => (
                      <>
                        <span>{championship.name}</span>
                        {isSelected && <CheckIcon className="size-5" />}
                      </>
                    )}
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
