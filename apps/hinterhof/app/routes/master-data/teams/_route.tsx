import type { Team } from '@haus23/tipprunde-model';
import { useState } from 'react';
import { VisuallyHidden } from 'react-aria';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Sheet, SheetDescription } from '@/components/ui/sheet';

import { useTeams } from '@/utils/state/teams';

import { actions, columns } from './column-defs';
import { EditSheet } from './edit-sheet';

function TeamsRoute() {
  const [isFormOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'new' | 'edit'>(undefined as never);
  const [editedTeam, setEditedTeam] = useState<Team>(undefined as never);

  const { teams } = useTeams();

  function openNewTeamForm() {
    setFormMode('new');
    setEditedTeam({ id: '', name: '', shortname: '' });
    setFormOpen(true);
  }

  actions.onEditClick = (team: Team) => {
    setFormMode('edit');
    setEditedTeam(team);
    setFormOpen(true);
  };

  return (
    <div>
      <header className="flex items-center justify-between">
        <Heading className="grow">Mannschaften / Vereine</Heading>
        <Button variant="outline" onClick={openNewTeamForm}>
          <span className="hidden sm:inline">Neue Mannschaft</span>
          <span className="inline sm:hidden">Neu</span>
        </Button>
      </header>
      <Sheet open={isFormOpen} onOpenChange={setFormOpen}>
        <VisuallyHidden>
          <SheetDescription>Mannschaft/Team Formular</SheetDescription>
        </VisuallyHidden>
        <EditSheet
          side="bottom"
          mode={formMode}
          team={editedTeam}
          onClose={() => setFormOpen(false)}
        />
      </Sheet>
      <Card className="mt-4">
        <DataTable columns={columns} data={teams} withPagination withFilter />
      </Card>
    </div>
  );
}

export { TeamsRoute as Component };
