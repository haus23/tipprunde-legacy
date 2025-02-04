import { Card } from '@/components/ui/card';
import type { Account } from '@haus23/tipprunde-model';
import { useState } from 'react';

import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { useAccounts } from '@/utils/state/accounts';

import { Button } from '@/components/ui/button';
import { Sheet, SheetDescription } from '@/components/ui/sheet';
import { VisuallyHidden } from 'react-aria';
import { actions, columns } from './column-defs';
import { EditSheet } from './edit-sheet';

function PlayersRoute() {
  const [isFormOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'new' | 'edit'>(undefined as never);
  const [editedAccount, setEditedAccount] = useState<Account>(
    undefined as never,
  );

  const { accounts } = useAccounts();

  function openNewAccountForm() {
    setFormMode('new');
    setEditedAccount({ id: '', name: '', email: '' });
    setFormOpen(true);
  }

  actions.onEditClick = (account: Account) => {
    setFormMode('edit');
    setEditedAccount(account);
    setFormOpen(true);
  };

  return (
    <div>
      <header className="flex items-center justify-between">
        <Heading className="grow">Spieler</Heading>
        <Button variant="outline" onClick={openNewAccountForm}>
          <span className="hidden sm:inline">Neuer Spieler</span>
          <span className="inline sm:hidden">Neu</span>
        </Button>
      </header>
      <Sheet open={isFormOpen} onOpenChange={setFormOpen}>
        <VisuallyHidden>
          <SheetDescription>Spieler Formular</SheetDescription>
        </VisuallyHidden>
        <EditSheet
          side="bottom"
          mode={formMode}
          account={editedAccount}
          onClose={() => setFormOpen(false)}
        />
      </Sheet>
      <Card className="mt-4">
        <DataTable
          columns={columns}
          data={accounts}
          withPagination
          withFilter
        />
      </Card>
    </div>
  );
}

export { PlayersRoute as Component };
