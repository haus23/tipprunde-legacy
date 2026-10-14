import { Combobox } from '@base-ui/react/combobox';
import type { Championship } from '@haus23/tipprunde-model';
import { CheckIcon, ChevronsUpDownIcon, SearchIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import ChampionshipStatus from '#/components/championship-status';
import { selectionItemStyles } from '#/components/form/selection';
import { useMasterDataStore } from '#/state/master-data-store';
import { focusRing } from '#/styles/focus';
import { cn } from '#/utils/cn';
import { championshipPages } from './current-data/championship-pages';

// Switches the championship of the championship pages. Stays on the same page
// (without the round); pages the new championship has no data for yet fall
// back to its dashboard.

function targetPath(championshipId: Championship['id'], pathname: string) {
  const page = pathname.split('/')[2];
  return championshipPages.some(({ path }) => path === page)
    ? `/${championshipId}/${page}`
    : `/${championshipId}`;
}

export default function ChampionshipSwitcher({
  championship,
}: {
  championship: Championship;
}) {
  const championships = useMasterDataStore((state) => state.championships);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const items = useMemo(
    () =>
      Combobox.createItems(championships, {
        getLabel: ({ name }) => name,
        getValue: ({ id }) => id,
      }),
    [championships],
  );

  return (
    <Combobox.Root
      items={items}
      autoHighlight
      value={championship.id}
      onValueChange={(id) => {
        if (id && id !== championship.id) navigate(targetPath(id, pathname));
      }}
      filter={(item, query) =>
        `${item.name} ${item.id}`.toLowerCase().includes(query.toLowerCase())
      }
    >
      <Combobox.Trigger
        aria-label="Turnier wechseln"
        className={cn(
          focusRing,
          'flex w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-left font-semibold text-sm shadow-xs hover:bg-accent data-popup-open:border-ring',
        )}
      >
        <span className="truncate">{championship.name}</span>
        <ChevronsUpDownIcon
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      </Combobox.Trigger>
      <Combobox.Portal>
        <Combobox.Positioner className="z-50" sideOffset={4} align="start">
          <Combobox.Popup className="w-(--anchor-width) min-w-64 overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-lg outline-hidden">
            <div className="flex items-center gap-2 border-border border-b px-3">
              <SearchIcon
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <Combobox.Input
                placeholder="Turnier suchen"
                aria-label="Turnier suchen"
                className="h-10 w-full bg-transparent text-sm outline-hidden placeholder:text-muted-foreground"
              />
            </div>
            <Combobox.Empty className="p-3 text-muted-foreground text-sm">
              Kein Turnier gefunden.
            </Combobox.Empty>
            <Combobox.List className="max-h-[min(20rem,var(--available-height))] overflow-y-auto overscroll-contain p-1">
              {(item: Championship) => (
                <Combobox.Item
                  key={item.id}
                  value={item.id}
                  className={cn(selectionItemStyles, 'gap-2')}
                >
                  <Combobox.ItemIndicator className="absolute left-2">
                    <CheckIcon className="size-4" aria-hidden="true" />
                  </Combobox.ItemIndicator>
                  <span className="truncate">{item.name}</span>
                  <ChampionshipStatus championship={item} className="ml-auto" />
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}
