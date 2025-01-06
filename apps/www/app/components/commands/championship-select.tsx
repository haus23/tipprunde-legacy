import {
  CheckIcon,
  FolderIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { Command } from 'cmdk';
import { useEffect, useState } from 'react';
import { VisuallyHidden } from 'react-aria';

import { useLocation, useNavigate } from 'react-router';
import { useOptionalChampionship } from '#/utils/app/championship';
import { useChampionships } from '#/utils/app/championships';
import { useCurrentView } from '#/utils/current-view';
import { Button } from '../(ui)/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '../(ui)/molecules/dialog';

export function ChampionshipSelect() {
  const [isOpen, setIsOpen] = useState(false);
  const { search } = useLocation();
  const navigate = useNavigate();

  const championships = useChampionships();
  const championship = useOptionalChampionship();
  const viewSegment = useCurrentView();

  useEffect(() => {
    const handleTriggerKey = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setIsOpen(true);
      }
    };
    document.addEventListener('keydown', handleTriggerKey);
    return () => document.removeEventListener('keydown', handleTriggerKey);
  }, []);

  function handleSelect(selectedValue: string) {
    const championshipId = selectedValue.slice(0, 6);
    setIsOpen(false);
    const championshipSegment =
      championships[0].id === championshipId ? '' : championshipId;
    navigate(
      {
        pathname: `/${[championshipSegment, viewSegment].filter(Boolean).join('/')}`,
        search: viewSegment === 'spiel' ? '' : search,
      },
      { viewTransition: true },
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="toolbar"
          className="space-x-2"
          aria-label="Öffne Turnier-Auswahl Dialog"
        >
          <MagnifyingGlassIcon className="h-6" />
          <span className="hidden sm:block">Turnier</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bottom-auto">
        <VisuallyHidden>
          <DialogTitle className="sr-only">Turnierauswahl</DialogTitle>
        </VisuallyHidden>
        <VisuallyHidden>
          <DialogDescription>
            Hier kann das Turnier gewechselt werden.
          </DialogDescription>
        </VisuallyHidden>
        <Command label="Turnier-Suchfeld">
          <Command.Input
            placeholder="Turnier"
            className="w-full rounded-md border-0 bg-subtle px-6 py-2.5 font-semibold text-foreground placeholder:text-subtle-foreground focus:outline-none"
          />
          <Command.List className="border-t border-line p-2">
            <Command.Empty>
              <div className="px-4 py-14 text-center text-subtle-foreground sm:px-14">
                <FolderIcon className="mx-auto h-6 w-6" aria-hidden="true" />
                <p className="mt-4 font-semibold">
                  Kein Turnier passt zu der Suche.
                </p>
              </div>
            </Command.Empty>
            {championships.map((c) => (
              <Command.Item
                key={c.id}
                value={c.id + c.name}
                className={[
                  'flex cursor-default select-none items-center justify-between rounded-md px-4 py-2 font-semibold data-[selected=true]:bg-neutral-hover',
                  championship?.id === c.id && 'text-accent-subtle-foreground',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onSelect={handleSelect}
              >
                <span>{c.name}</span>
                {championship?.id === c.id && <CheckIcon className="h-6" />}
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
