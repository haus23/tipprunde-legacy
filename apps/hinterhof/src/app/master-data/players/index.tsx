import {
  Form,
  Field as FormField,
  focus,
  getInput,
  isDirty,
  reset,
  setErrors,
  useForm,
} from '@formisch/react';
import type { Member } from '@haus23/tipprunde-model';
import { cn } from 'cn';
import { ChevronDownIcon, PencilIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import * as v from 'valibot';
import Button from '#/components/button';
import TextField from '#/components/form/text-field';
import AppCard from '#/components/layout/app-card';
import { usePlayers } from '#/hooks/master-data/use-players';
import { emailValidator } from '#/utils/email-validator';
import { invalidateCache } from '#/utils/invalidate-cache';
import { notify } from '#/utils/notify';
import { slug } from '#/utils/slug';

const requiredMessage = 'Bitte ausfüllen.';

const PlayerFormSchema = v.object({
  name: v.pipe(v.string(), v.trim(), v.nonEmpty(requiredMessage)),
  id: v.pipe(v.string(), v.trim(), v.nonEmpty(requiredMessage)),
  email: v.pipe(
    v.string(),
    v.trim(),
    v.check(
      (email) => email === '' || emailValidator.test(email),
      'Keine korrekte Email-Adresse.',
    ),
  ),
});

const emptyPlayer: Member = { id: '', name: '', email: '' };

export default function PlayersView() {
  const playerForm = useForm({
    schema: PlayerFormSchema,
    initialInput: emptyPlayer,
  });

  const { players, createPlayer, updatePlayer } = usePlayers();
  const [isFormOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  function beginEdit(player: Member) {
    reset(playerForm, {
      initialInput: { ...player, email: player.email ?? '' },
    });
    setEditMode(true);
    setFormOpen(true);
    topRef.current?.scrollIntoView();
  }

  function endEdit() {
    reset(playerForm, { initialInput: emptyPlayer });
    setEditMode(false);
    setFormOpen(false);
  }

  function handleNameChange() {
    const sluggedName = slug(getInput(playerForm, { path: ['name'] }) ?? '');
    if (!editMode && sluggedName && !isDirty(playerForm, { path: ['id'] })) {
      reset(playerForm, { path: ['id'], initialInput: sluggedName });
    }
  }

  async function savePlayer(player: Member) {
    if (!editMode) {
      const duplicateName = players.some((item) => item.name === player.name);
      const duplicateId = players.some((item) => item.id === player.id);

      setErrors(playerForm, {
        path: ['name'],
        errors: duplicateName
          ? ['Spieler mit diesem Namen ist schon angelegt.']
          : null,
      });
      setErrors(playerForm, {
        path: ['id'],
        errors: duplicateId
          ? ['Spieler mit dieser Kennung ist schon angelegt.']
          : null,
      });

      if (duplicateName || duplicateId) {
        focus(playerForm, { path: duplicateName ? ['name'] : ['id'] });
        return;
      }

      await notify(
        createPlayer(player).then(() =>
          invalidateCache([{ type: 'collection', name: 'accounts' }]),
        ),
        `${player.name} angelegt.`,
      );
      reset(playerForm, { initialInput: emptyPlayer });
      focus(playerForm, { path: ['name'] });
    } else {
      await notify(
        updatePlayer(player).then(() =>
          invalidateCache([{ type: 'collection', name: 'accounts' }]),
        ),
        `${player.name} geändert.`,
      );
      endEdit();
    }
  }

  return (
    <div ref={topRef} className="space-y-4">
      <h2 className="font-semibold text-2xl">Spieler</h2>
      <div className="mt-5">
        <div className="rounded-md bg-white shadow-sm sm:overflow-hidden">
          <button
            type="button"
            onClick={() => setFormOpen(!isFormOpen)}
            className="flex w-full items-center justify-between px-4 py-2 font-semibold"
          >
            <span>{editMode ? 'Spieler bearbeiten' : 'Neuer Spieler'}</span>
            <ChevronDownIcon
              className={cn(
                'h-5 w-5 transition-transform',
                isFormOpen && 'rotate-180 transform',
              )}
            />
          </button>
          {isFormOpen && (
            <div>
              <Form of={playerForm} onSubmit={savePlayer}>
                <div className="space-y-4 p-4">
                  <FormField of={playerForm} path={['name']}>
                    {(field) => (
                      <TextField
                        {...field.props}
                        autoFocus={true}
                        label="Name"
                        required={true}
                        value={field.input ?? ''}
                        error={field.errors?.[0]}
                        onBlur={() => {
                          field.props.onBlur();
                          handleNameChange();
                        }}
                      />
                    )}
                  </FormField>
                  <FormField of={playerForm} path={['id']}>
                    {(field) => (
                      <TextField
                        {...field.props}
                        label="Kennung"
                        required={true}
                        disabled={editMode}
                        value={field.input ?? ''}
                        error={field.errors?.[0]}
                      />
                    )}
                  </FormField>
                  <FormField of={playerForm} path={['email']}>
                    {(field) => (
                      <TextField
                        {...field.props}
                        label="Email"
                        value={field.input ?? ''}
                        error={field.errors?.[0]}
                      />
                    )}
                  </FormField>
                </div>
                <div className="space-x-4 bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <Button onClick={endEdit}>Abbrechen</Button>
                  <Button variant="primary" type="submit">
                    Speichern
                  </Button>
                </div>
              </Form>
            </div>
          )}
        </div>
      </div>
      <AppCard>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pr-3 pl-4 text-left font-semibold text-gray-900 text-sm"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left font-semibold text-gray-900 text-sm sm:table-cell sm:pr-6 lg:pr-8"
                >
                  Email
                </th>
                <th scope="col" className="py-3.5 pl-3 sm:pl-6 lg:pl-8">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white pr-1">
              {players.map((p) => (
                <tr key={p.id}>
                  <td className="whitespace-nowrap py-4 pr-3 pl-4 text-gray-500 text-sm">
                    {p.name}
                  </td>
                  <td className="hidden whitespace-nowrap py-4 pr-4 pl-3 text-gray-500 text-sm sm:table-cell sm:pr-6 lg:pr-8">
                    {p.email}
                  </td>
                  <td className="pr-3 text-right">
                    <Button onClick={() => beginEdit(p)}>
                      <PencilIcon className="h-4 w-4 text-indigo-600 hover:text-indigo-900" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AppCard>
    </div>
  );
}
