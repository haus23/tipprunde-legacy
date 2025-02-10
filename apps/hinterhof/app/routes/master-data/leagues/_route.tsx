import type { League } from '@haus23/tipprunde-model';
import { useState } from 'react';
import { VisuallyHidden } from 'react-aria';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Sheet, SheetDescription } from '@/components/ui/sheet';

import { useLeagues } from '@/utils/state/leagues';
import { actions, columns } from './column-defs';
import { EditSheet } from './edit-sheet';

function LeaguesRoute() {
  const [isFormOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'new' | 'edit'>(undefined as never);
  const [editedLeague, setEditedLeague] = useState<League>(undefined as never);

  const { leagues } = useLeagues();

  function openNewLeagueForm() {
    setFormMode('new');
    setEditedLeague({ id: '', name: '', shortname: '' });
    setFormOpen(true);
  }

  actions.onEditClick = (league: League) => {
    setFormMode('edit');
    setEditedLeague(league);
    setFormOpen(true);
  };

  return (
    <div>
      <header className="flex items-center justify-between">
        <Heading className="grow">Ligen / Runden</Heading>
        <Button variant="outline" onClick={openNewLeagueForm}>
          <span className="hidden sm:inline">Neue Liga</span>
          <span className="inline sm:hidden">Neu</span>
        </Button>
      </header>
      <Sheet open={isFormOpen} onOpenChange={setFormOpen}>
        <VisuallyHidden>
          <SheetDescription>Liga Formular</SheetDescription>
        </VisuallyHidden>
        <EditSheet
          side="bottom"
          mode={formMode}
          league={editedLeague}
          onClose={() => setFormOpen(false)}
        />
      </Sheet>
      <Card className="mt-4">
        <DataTable columns={columns} data={leagues} withPagination withFilter />
      </Card>
    </div>
  );
}

export { LeaguesRoute as Component };
