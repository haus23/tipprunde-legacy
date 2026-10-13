import type { League } from '@haus23/tipprunde-model';
import { PencilIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import Button from '#/components/button';
import DataCard from '#/components/layout/data-card';
import LeagueDialog from '#/components/master-data/league-dialog';
import { useLeagues } from '#/hooks/master-data/use-leagues';

export default function LeaguesView() {
  const { leagues } = useLeagues();
  const [dialogOpen, setDialogOpen] = useState(false);
  // Kept while the dialog closes, so its title does not switch mid-animation
  const [editedLeague, setEditedLeague] = useState<League>();

  function openDialog(league?: League) {
    setEditedLeague(league);
    setDialogOpen(true);
  }

  return (
    <div className="mt-5">
      <DataCard
        title="Ligen / Runden"
        description="Ligen und Runden anlegen und bearbeiten."
        action={
          <Button
            variant="primary"
            className="max-sm:w-9 max-sm:px-0"
            onClick={() => openDialog()}
          >
            <PlusIcon
              className="size-4 sm:mr-1.5 sm:-ml-1"
              aria-hidden="true"
            />
            <span className="max-sm:sr-only">Neue Liga</span>
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-surface-subtle">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pr-2 pl-4 text-left font-semibold text-foreground text-sm sm:pl-6"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="hidden px-2 py-3.5 text-left font-semibold text-foreground text-sm sm:table-cell"
                >
                  Kürzel
                </th>
                <th scope="col" className="py-3.5 pr-4 pl-2 sm:pr-6">
                  <span className="sr-only">Bearbeiten</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {leagues.map((league) => (
                <tr key={league.id}>
                  <td className="py-4 pr-2 pl-4 text-muted-foreground text-sm sm:pl-6">
                    {league.name}
                  </td>
                  <td className="hidden whitespace-nowrap px-2 py-4 text-muted-foreground text-sm sm:table-cell">
                    {league.shortname}
                  </td>
                  <td className="py-2 pr-4 pl-2 text-right sm:pr-6">
                    <Button
                      size="icon"
                      aria-label={`${league.name} bearbeiten`}
                      onClick={() => openDialog(league)}
                    >
                      <PencilIcon className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataCard>
      <LeagueDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        league={editedLeague}
      />
    </div>
  );
}
