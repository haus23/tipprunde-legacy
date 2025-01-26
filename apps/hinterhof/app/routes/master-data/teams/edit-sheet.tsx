import { type Team, type TeamInput, TeamSchema } from '@haus23/tipprunde-model';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { useForm } from 'react-hook-form';

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
import { useEffect } from 'react';

namespace EditSheet {
  export interface Props extends React.ComponentProps<typeof SheetContent> {
    mode: 'new' | 'edit';
    team: Team;
  }
}

export function EditSheet({ mode, team, ...props }: EditSheet.Props) {
  const form = useForm<TeamInput>({
    resolver: valibotResolver(TeamSchema),
    defaultValues: team,
  });

  useEffect(() => {
    form.reset(team);
  }, [form, team]);

  function saveTeam(data: Team) {
    console.log(data);
  }

  function handleNameChange() {
    const name = form.getValues('name').trim();
    if (mode === 'new' && name && !form.formState.dirtyFields.shortname) {
      form.setValue('shortname', name, { shouldValidate: true });
    }
  }
  function handleShortnameChange() {
    const sluggedName = slug(form.getValues('shortname'));
    if (mode === 'new' && sluggedName && !form.formState.dirtyFields.id) {
      form.setValue('id', sluggedName, { shouldValidate: true });
    }
  }

  return (
    <SheetContent {...props}>
      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(saveTeam)}>
          <SheetHeader>
            <SheetTitle>
              {mode === 'new' ? 'Neue Mannschaft' : 'Mannschaft bearbeiten'}
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
                      type="text"
                      placeholder="Offizieller Name"
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
              name="shortname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kurzname *</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Typische Kurzform (eindeutig)"
                      {...field}
                      onBlur={handleShortnameChange}
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
