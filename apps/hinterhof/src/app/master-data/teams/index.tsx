import type { Team } from '@haus23/tipprunde-model';
import { PencilIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import Button from '#/components/button';
import DataCard from '#/components/layout/data-card';
import TeamDialog from '#/components/master-data/team-dialog';
import { useTeams } from '#/hooks/master-data/use-teams';

export default function TeamsView() {
  const { teams } = useTeams();
  const [dialogOpen, setDialogOpen] = useState(false);
  // Kept while the dialog closes, so its title does not switch mid-animation
  const [editedTeam, setEditedTeam] = useState<Team>();

  function openDialog(team?: Team) {
    setEditedTeam(team);
    setDialogOpen(true);
  }

  return (
    <div className="mt-5">
      <DataCard
        title="Mannschaften / Vereine"
        description="Mannschaften und Vereine anlegen und bearbeiten."
        action={
          <Button variant="primary" onClick={() => openDialog()}>
            <PlusIcon className="mr-1.5 -ml-1 size-4" aria-hidden="true" />
            Neue Mannschaft
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
              {teams.map((team) => (
                <tr key={team.id}>
                  <td className="py-4 pr-2 pl-4 text-muted-foreground text-sm sm:pl-6">
                    {team.name}
                  </td>
                  <td className="hidden whitespace-nowrap px-2 py-4 text-muted-foreground text-sm sm:table-cell">
                    {team.shortname}
                  </td>
                  <td className="py-2 pr-4 pl-2 text-right sm:pr-6">
                    <Button
                      size="icon"
                      aria-label={`${team.name} bearbeiten`}
                      onClick={() => openDialog(team)}
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
      <TeamDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        team={editedTeam}
      />
    </div>
  );
}
