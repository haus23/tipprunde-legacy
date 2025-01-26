import type { Team } from '@haus23/tipprunde-model';
import { SquarePen } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Sheet, SheetDescription } from '@/components/ui/sheet';
import { Table } from '#/components/ui-justd';
import { useTeams } from '#/utils/state/teams';

import { EditSheet } from './edit-sheet';

export default function TeamsRoute() {
  const [isFormOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'new' | 'edit'>(undefined as never);
  const [editedTeam, setEditedTeam] = useState<Team>(undefined as never);

  const teams = useTeams();

  function openNewTeamForm() {
    setFormMode('new');
    setEditedTeam({ id: '', name: '', shortname: '' });
    setFormOpen(true);
  }

  function openEditTeamForm(team: Team) {
    setFormMode('edit');
    setEditedTeam(team);
    setFormOpen(true);
  }

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
        <SheetDescription>Mannschaft/Team Formular</SheetDescription>
        <EditSheet mode={formMode} team={editedTeam} />
      </Sheet>
      <Card className="mt-4">
        <Table aria-label="Teams">
          <Table.Header>
            <Table.Column isRowHeader>Name</Table.Column>
            <Table.Column className="hidden sm:table-cell">Kürzel</Table.Column>
            <Table.Column />
          </Table.Header>
          <Table.Body items={teams}>
            {(team) => (
              <Table.Row id={team.id}>
                <Table.Cell>{team.name}</Table.Cell>
                <Table.Cell className="hidden sm:table-cell">
                  {team.shortname}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditTeamForm(team)}
                    >
                      <SquarePen />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Card>
    </div>
  );
}
