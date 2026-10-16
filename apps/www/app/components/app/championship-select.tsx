import { Combobox } from '@base-ui/react/combobox';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { useMemo } from 'react';

import {
  componentHoverStyles,
  focusVisibleStyles,
} from '#/components/ui/_styles';
import { useChampionship } from '#/utils/app/championship';
import { cn } from '#/utils/cn';
import { championshipsQuery } from '#/utils/queries';
import { useAppShell } from './app-shell';

// The current championship in the header; it opens the championship list
// with a filter field on top (also Cmd/Ctrl+K).
export function ChampionshipSelect({ className }: { className?: string }) {
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
    <Combobox.Root
      items={items}
      value={championship.id}
      onValueChange={selectChampionship}
      open={isChampionshipSelectOpen}
      onOpenChange={setChampionshipSelectOpen}
      autoHighlight
    >
      <Combobox.Trigger
        aria-label={`Turnier: ${championship.name}, wechseln`}
        className={cn(
          focusVisibleStyles,
          // Same look as the other header items; on phones it is the page
          // title, so it keeps the full text color there.
          componentHoverStyles,
          'group flex min-w-0 items-center gap-x-1.5 p-2 transition-colors data-popup-open:bg-highlight data-popup-open:text-foreground max-md:text-foreground',
          className,
        )}
      >
        <span className="truncate">{championship.name}</span>
        <ChevronDownIcon
          className="size-5 shrink-0 transition-transform group-data-popup-open:rotate-180 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </Combobox.Trigger>
      <Combobox.Portal>
        <Combobox.Positioner align="end" sideOffset={6} collisionPadding={16}>
          <Combobox.Popup
            aria-label="Turnier-Auswahl"
            className="flex max-h-[min(70svh,var(--available-height))] w-[min(20rem,calc(100vw-2rem))] flex-col rounded-md bg-popover py-2 font-medium text-base shadow-elevation shadow-md outline-hidden ring-1 ring-border transition-[opacity,scale] duration-150 data-ending-style:scale-95 data-starting-style:scale-95 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none dark:shadow-none"
          >
            <Combobox.Input
              placeholder="Turnier filtern …"
              aria-label="Turniere filtern"
              className="w-full bg-transparent px-4 py-2 outline-hidden placeholder:text-muted-foreground"
            />
            <hr className="mt-1" />
            <Combobox.Empty className="px-4 py-3 text-muted-foreground empty:p-0">
              Kein Turnier gefunden.
            </Combobox.Empty>
            <Combobox.List className="mt-1 overflow-y-auto overscroll-contain px-2">
              {(item: (typeof championships)[number]) => (
                <Combobox.Item
                  key={item.id}
                  value={item.id}
                  className={cn(
                    componentHoverStyles,
                    'my-1 flex select-none items-center justify-between rounded-sm px-2 py-1.5 outline-hidden data-highlighted:bg-highlight data-highlighted:text-foreground data-selected:text-accent',
                  )}
                >
                  <span>{item.name}</span>
                  <Combobox.ItemIndicator>
                    <CheckIcon className="size-5" aria-hidden="true" />
                  </Combobox.ItemIndicator>
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}
