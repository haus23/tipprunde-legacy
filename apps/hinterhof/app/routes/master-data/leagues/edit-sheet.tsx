import {
  type League,
  type LeagueInput,
  LeagueSchema,
} from '@haus23/tipprunde-model';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { useEffect, useMemo } from 'react';
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
import { useLeagues } from '@/utils/state/leagues';
import { toast } from '@/utils/toast';

namespace EditSheet {
  export interface Props extends React.ComponentProps<typeof SheetContent> {
    mode: 'new' | 'edit';
    league: League;
    // Better use Context (must be implemented)
    onClose?: () => void;
  }
}

export function EditSheet({
  mode,
  league,
  onClose = () => {},
  ...props
}: EditSheet.Props) {
  const { leagues, createLeague, updateLeague } = useLeagues();

  const otherLeagues = useMemo(
    () => leagues.filter((l) => l.id !== league?.id),
    [league, leagues],
  );

  const form = useForm<LeagueInput>({
    resolver: valibotResolver(LeagueSchema),
    defaultValues: league,
  });

  useEffect(() => {
    form.reset(league);
  }, [form, league]);

  async function saveLeague(league: League) {
    if (otherLeagues.some((l) => l.name === league.name)) {
      form.setError('name', { message: 'Name schon vorhanden' });
      return;
    }
    if (otherLeagues.some((l) => l.shortname === league.shortname)) {
      form.setError('shortname', { message: 'Kurzname schon vorhanden' });
      return;
    }
    if (otherLeagues.some((l) => l.id === league.id)) {
      form.setError('id', { message: 'Kennung schon vorhanden' });
      return;
    }

    if (mode === 'new') {
      toast.promise(createLeague(league), {
        loading: 'Speichern',
        success: `${league.name} angelegt`,
        error: 'Hoppla, das hat nicht geklappt.',
      });
    } else {
      toast.promise(updateLeague(league), {
        loading: 'Speichern',
        success: `${league.name} geändert.`,
        error: 'Hoppla, das hat nicht geklappt.',
      });
    }

    onClose();
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
        <form noValidate onSubmit={form.handleSubmit(saveLeague)}>
          <SheetHeader>
            <SheetTitle>
              {mode === 'new' ? 'Neue Liga' : 'Liga bearbeiten'}
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
                      placeholder="Name"
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
                      placeholder="Kurzform (eindeutig)"
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
