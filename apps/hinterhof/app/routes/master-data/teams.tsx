import { IconPencilBox } from 'justd-icons';
import { Button, Card, Heading, Table } from '#/components/ui';
import { useTeams } from '#/utils/state/teams';

export default function TeamsRoute() {
  const teams = useTeams();

  return (
    <div>
      <Heading>Teams</Heading>
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
                    <Button size="square-petite" appearance="outline">
                      <IconPencilBox />
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
