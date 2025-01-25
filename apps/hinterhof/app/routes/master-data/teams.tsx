import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Team } from '@haus23/tipprunde-model';
import { SquarePen } from 'lucide-react';
import { useState } from 'react';
import { Form, Heading, Sheet, Table, TextField } from '#/components/ui-justd';
import { useTeams } from '#/utils/state/teams';

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

  function saveTeam(data: FormData) {
    console.log(Object.fromEntries(data));
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
      <Sheet.Content isOpen={isFormOpen} onOpenChange={setFormOpen}>
        <Form action={saveTeam}>
          <Sheet.Header>
            <Sheet.Title>
              {formMode === 'new' ? 'Neue Mannschaft' : 'Mannschaft bearbeiten'}
            </Sheet.Title>
          </Sheet.Header>
          <Sheet.Body className="space-y-2">
            <TextField
              defaultValue={editedTeam?.name}
              name="name"
              label="Name *"
              type="text"
              placeholder="Offizieller Name"
              isRequired
            />
            <TextField
              defaultValue={editedTeam?.shortname}
              name="shortname"
              label="Kürzel *"
              type="text"
              placeholder="Typisches Kürzel (eindeutig)"
              isRequired
            />
            <TextField
              defaultValue={editedTeam?.id}
              name="id"
              label="Kennung *"
              type="text"
              placeholder="Eindeutige ID"
              isRequired
              isDisabled={formMode === 'edit'}
            />
          </Sheet.Body>
          <Sheet.Footer>
            <Sheet.Close>Abbrechen</Sheet.Close>
            <Button type="submit">Speichern</Button>
          </Sheet.Footer>
        </Form>
      </Sheet.Content>
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
