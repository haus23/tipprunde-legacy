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
import { type League, slugIdRegEx } from '@haus23/tipprunde-model';
import { cn } from '#/utils/cn';
import { ChevronDownIcon, PencilIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import * as v from 'valibot';
import Button from '#/components/button';
import TextField from '#/components/form/text-field';
import AppCard from '#/components/layout/app-card';
import { useLeagues } from '#/hooks/master-data/use-leagues';
import { invalidateCache } from '#/utils/invalidate-cache';
import { notify } from '#/utils/notify';
import { slug } from '#/utils/slug';

const requiredMessage = 'Bitte ausfüllen.';

const LeagueFormSchema = v.object({
  name: v.pipe(v.string(), v.trim(), v.nonEmpty(requiredMessage)),
  shortname: v.pipe(v.string(), v.trim(), v.nonEmpty(requiredMessage)),
  id: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty(requiredMessage),
    v.regex(slugIdRegEx, 'Nur Kleinbuchstaben, Ziffern und Bindestriche.'),
  ),
});

const emptyLeague: League = { id: '', name: '', shortname: '' };

export default function LeaguesView() {
  const leagueForm = useForm({
    schema: LeagueFormSchema,
    initialInput: emptyLeague,
  });

  const { leagues, createLeague, updateLeague } = useLeagues();
  const [isFormOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  function beginEdit(league: League) {
    reset(leagueForm, { initialInput: league });
    setEditMode(true);
    setFormOpen(true);
    topRef.current?.scrollIntoView();
  }

  function endEdit() {
    reset(leagueForm, { initialInput: emptyLeague });
    setEditMode(false);
    setFormOpen(false);
  }

  function handleNameChange() {
    const name = (getInput(leagueForm, { path: ['name'] }) ?? '').trim();
    if (!editMode && name && !isDirty(leagueForm, { path: ['shortname'] })) {
      reset(leagueForm, { path: ['shortname'], initialInput: name });
    }
  }
  function handleShortnameChange() {
    const sluggedName = slug(
      getInput(leagueForm, { path: ['shortname'] }) ?? '',
    );
    if (!editMode && sluggedName && !isDirty(leagueForm, { path: ['id'] })) {
      reset(leagueForm, { path: ['id'], initialInput: sluggedName });
    }
  }

  async function saveLeague(league: League) {
    if (!editMode) {
      const duplicateName = leagues.some((item) => item.name === league.name);
      const duplicateShortname = leagues.some(
        (item) => item.shortname === league.shortname,
      );
      const duplicateId = leagues.some((item) => item.id === league.id);

      setErrors(leagueForm, {
        path: ['name'],
        errors: duplicateName
          ? ['Liga mit diesem Namen ist schon angelegt.']
          : null,
      });
      setErrors(leagueForm, {
        path: ['shortname'],
        errors: duplicateShortname
          ? ['Liga mit diesem Kürzel ist schon angelegt.']
          : null,
      });
      setErrors(leagueForm, {
        path: ['id'],
        errors: duplicateId
          ? ['Liga mit dieser Kennung ist schon angelegt.']
          : null,
      });

      if (duplicateName || duplicateShortname || duplicateId) {
        focus(leagueForm, {
          path: duplicateName
            ? ['name']
            : duplicateShortname
              ? ['shortname']
              : ['id'],
        });
        return;
      }
    }

    if (editMode) {
      await notify(
        updateLeague(league).then(() =>
          invalidateCache([{ type: 'collection', name: 'leagues' }]),
        ),
        `${league.name} geändert.`,
      );
      endEdit();
    } else {
      await notify(
        createLeague(league).then(() =>
          invalidateCache([{ type: 'collection', name: 'leagues' }]),
        ),
        `${league.name} angelegt`,
      );
      reset(leagueForm, { initialInput: emptyLeague });
      focus(leagueForm, { path: ['name'] });
    }
  }

  return (
    <div ref={topRef} className="space-y-4">
      <h2 className="font-semibold text-2xl">Ligen / Runden</h2>
      <div className="mt-5">
        <div className="rounded-md bg-white shadow-sm sm:overflow-hidden">
          <button
            type="button"
            onClick={() => setFormOpen(!isFormOpen)}
            className="flex w-full items-center justify-between px-4 py-2 font-semibold"
          >
            <span>{editMode ? 'Liga bearbeiten' : 'Neue Liga'}</span>
            <ChevronDownIcon
              className={cn(
                'h-5 w-5 transition-transform',
                isFormOpen && 'rotate-180 transform',
              )}
            />
          </button>
          {isFormOpen && (
            <div>
              <Form of={leagueForm} onSubmit={saveLeague}>
                <div className="space-y-4 p-4">
                  <FormField of={leagueForm} path={['name']}>
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
                  <FormField of={leagueForm} path={['shortname']}>
                    {(field) => (
                      <TextField
                        {...field.props}
                        label="Kürzel"
                        required={true}
                        value={field.input ?? ''}
                        error={field.errors?.[0]}
                        onBlur={() => {
                          field.props.onBlur();
                          handleShortnameChange();
                        }}
                      />
                    )}
                  </FormField>
                  <FormField of={leagueForm} path={['id']}>
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
                  className="hidden px-3 py-3.5 text-left font-semibold text-gray-900 text-sm sm:table-cell"
                >
                  Kürzel
                </th>
                <th scope="col" className="py-3.5 pl-3 sm:pl-6 lg:pl-8">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white pr-1">
              {leagues.map((league) => (
                <tr key={league.id}>
                  <td className="whitespace-nowrap py-4 pr-3 pl-4 text-gray-500 text-sm">
                    {league.name}
                  </td>
                  <td className="hidden whitespace-nowrap px-3 py-4 text-gray-500 text-sm sm:table-cell">
                    {league.shortname}
                  </td>
                  <td className="pr-3 text-right">
                    <Button onClick={() => beginEdit(league)}>
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
