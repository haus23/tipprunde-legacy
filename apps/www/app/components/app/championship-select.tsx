import { Combobox } from '@base-ui/react/combobox';
import { Dialog } from '@base-ui/react/dialog';
import { Separator } from '@base-ui/react/separator';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { CheckIcon } from 'lucide-react';
import { useMemo } from 'react';

import { componentHoverStyles } from '#/components/ui/_styles';
import { useChampionship } from '#/utils/app/championship';
import { cn } from '#/utils/cn';
import { championshipsQuery } from '#/utils/queries';
import { useAppShell } from './app-shell';

// Search dialog over all championships (also Cmd/Ctrl+K). The list stays
// visible below the search field instead of opening as a popup.
export function ChampionshipSelect() {
  const { isChampionshipSelectOpen, setChampionshipSelectOpen } = useAppShell();
  const navigate = useNavigate();
  const { data: championships } = useQuery({
    ...championshipsQuery(),
    initialData: [],
  });
  const championship = useChampionship();

  const items = useMemo(
    () =>
      Combobox.createItems(championships, {
        getLabel: ({ name }) => name,
        getValue: ({ id }) => id,
      }),
    [championships],
  );

  function selectChampionship(turnier: string | null) {
    setChampionshipSelectOpen(false);
    if (turnier && turnier !== championship.id) {
      navigate({ to: '/$turnier', params: { turnier } });
    }
  }

  return (
    <Dialog.Root
      open={isChampionshipSelectOpen}
      onOpenChange={setChampionshipSelectOpen}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-30 bg-background/50 backdrop-blur-[2px] transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none" />
        <Dialog.Popup
          aria-label="Turnier-Auswahl"
          className="fixed inset-4 bottom-auto z-30 mx-auto max-w-lg rounded-md bg-background py-2 font-medium shadow-elevation shadow-md outline-hidden ring-1 ring-border transition-[opacity,scale] duration-150 data-ending-style:scale-95 data-starting-style:scale-95 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none dark:shadow-none"
        >
          <Combobox.Root
            inline
            open
            items={items}
            value={championship.id}
            onValueChange={selectChampionship}
            autoHighlight
          >
            <Combobox.Input
              placeholder="Turnier"
              aria-label="Turniere durchsuchen"
              className="w-full bg-transparent px-6 py-2 outline-hidden"
            />
            <Separator className="mt-2 border-t" />
            <Combobox.Empty className="px-6 py-4 text-muted-foreground empty:p-0">
              Kein Turnier gefunden.
            </Combobox.Empty>
            <Combobox.List className="mt-2 max-h-[70svh] overflow-y-auto px-2">
              {(item: (typeof championships)[number]) => (
                <Combobox.Item
                  key={item.id}
                  value={item.id}
                  className={cn(
                    componentHoverStyles,
                    'my-1.5 flex select-none items-center justify-between rounded-sm px-4 py-1.5 outline-hidden data-highlighted:bg-highlight data-highlighted:text-foreground data-selected:text-accent',
                  )}
                >
                  <span>{item.name}</span>
                  <Combobox.ItemIndicator>
                    <CheckIcon className="size-5" aria-hidden="true" />
                  </Combobox.ItemIndicator>
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Root>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
