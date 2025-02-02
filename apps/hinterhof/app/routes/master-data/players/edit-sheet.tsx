import {
  type Account,
  type AccountInput,
  AccountSchema,
} from '@haus23/tipprunde-model';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { useForm } from 'react-hook-form';
import * as v from 'valibot';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { slug } from '@/utils/slug';
import { useAccounts } from '@/utils/state/accounts';
import { toast } from '@/utils/toast';
import { useEffect, useMemo } from 'react';

namespace EditSheet {
  export interface Props extends React.ComponentProps<typeof SheetContent> {
    mode: 'new' | 'edit';
    account: Account;
    // Better use Context (must be implemented)
    onClose?: () => void;
  }
}

export function EditSheet({
  mode,
  account,
  onClose = () => {},
  ...props
}: EditSheet.Props) {
  const { accounts, createAccount, updateAccount } = useAccounts();

  const otherAccounts = useMemo(
    () => accounts.filter((a) => a.id !== account?.id),
    [account, accounts],
  );

  const form = useForm<AccountInput>({
    resolver: valibotResolver(AccountSchema),
    defaultValues: account,
  });

  useEffect(() => {
    form.reset(account);
  }, [form, account]);

  async function saveAccount(accountData: AccountInput) {
    if (otherAccounts.some((acc) => acc.name === accountData.name)) {
      form.setError('name', { message: 'Name schon vorhanden' });
      return;
    }
    if (
      accountData.email &&
      otherAccounts.some((acc) => acc.email === accountData.email)
    ) {
      form.setError('email', { message: 'Email-Adresse schon genutzt' });
      return;
    }
    if (otherAccounts.some((acc) => acc.id === accountData.id)) {
      form.setError('id', { message: 'Kennung schon vorhanden' });
      return;
    }

    const account = v.parse(AccountSchema, accountData);
    if (mode === 'new') {
      toast.promise(createAccount(account), {
        loading: 'Speichern',
        success: `${accountData.name} angelegt`,
        error: 'Hoppla, das hat nicht geklappt.',
      });
    } else {
      toast.promise(updateAccount(account), {
        loading: 'Speichern',
        success: `${accountData.name} geändert.`,
        error: 'Hoppla, das hat nicht geklappt.',
      });
    }

    onClose();
  }

  function handleNameChange() {
    const sluggedName = slug(form.getValues('name').trim());
    if (mode === 'new' && sluggedName && !form.formState.dirtyFields.id) {
      form.setValue('id', sluggedName, { shouldValidate: true });
    }
  }

  return (
    <SheetContent {...props}>
      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(saveAccount)}>
          <SheetHeader>
            <SheetTitle>
              {mode === 'new' ? 'Neuer Spieler' : 'Spieler bearbeiten'}
            </SheetTitle>
          </SheetHeader>

          <div className="my-4 space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input
                      autoFocus
                      type="text"
                      {...field}
                      onBlur={handleNameChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email-Adresse (eindeutig)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kennung *</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Eindeutige ID (Kleinbuchstaben)"
                      disabled={mode === 'edit'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="secondary">Abbrechen</Button>
            </SheetClose>
            <Button type="submit">Speichern</Button>
          </SheetFooter>
        </form>
      </Form>
    </SheetContent>
  );
}
