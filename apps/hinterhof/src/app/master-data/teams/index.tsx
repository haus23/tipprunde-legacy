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
import { slugIdRegEx, type Team } from '@haus23/tipprunde-model';
import { ChevronDownIcon, PencilIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import * as v from 'valibot';
import Button from '#/components/button';
import TextField from '#/components/form/text-field';
import AppCard from '#/components/layout/app-card';
import { useTeams } from '#/hooks/master-data/use-teams';
import { cn } from '#/utils/cn';
import { invalidateCache } from '#/utils/invalidate-cache';
import { notify } from '#/utils/notify';
import { slug } from '#/utils/slug';

const requiredMessage = 'Bitte ausfüllen.';

const TeamFormSchema = v.object({
  name: v.pipe(v.string(), v.trim(), v.nonEmpty(requiredMessage)),
  shortname: v.pipe(v.string(), v.trim(), v.nonEmpty(requiredMessage)),
  id: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty(requiredMessage),
    v.regex(slugIdRegEx, 'Nur Kleinbuchstaben, Ziffern und Bindestriche.'),
  ),
});

const emptyTeam: Team = { id: '', name: '', shortname: '' };

export default function TeamsView() {
  const teamForm = useForm({
    schema: TeamFormSchema,
    initialInput: emptyTeam,
  });

  const { teams, createTeam, updateTeam } = useTeams();
  const [isFormOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  function beginEdit(team: Team) {
    reset(teamForm, { initialInput: team });
    setEditMode(true);
    setFormOpen(true);
    topRef.current?.scrollIntoView();
  }

  function endEdit() {
    reset(teamForm, { initialInput: emptyTeam });
    setEditMode(false);
    setFormOpen(false);
  }

  function handleNameChange() {
    const name = (getInput(teamForm, { path: ['name'] }) ?? '').trim();
    if (!editMode && name && !isDirty(teamForm, { path: ['shortname'] })) {
      reset(teamForm, { path: ['shortname'], initialInput: name });
    }
  }
  function handleShortnameChange() {
    const sluggedName = slug(getInput(teamForm, { path: ['shortname'] }) ?? '');
    if (!editMode && sluggedName && !isDirty(teamForm, { path: ['id'] })) {
      reset(teamForm, { path: ['id'], initialInput: sluggedName });
    }
  }

  async function saveTeam(team: Team) {
    if (!editMode) {
      const duplicateName = teams.some((item) => item.name === team.name);
      const duplicateShortname = teams.some(
        (item) => item.shortname === team.shortname,
      );
      const duplicateId = teams.some((item) => item.id === team.id);

      setErrors(teamForm, {
        path: ['name'],
        errors: duplicateName
          ? ['Mannschaft mit diesem Namen ist schon angelegt.']
          : null,
      });
      setErrors(teamForm, {
        path: ['shortname'],
        errors: duplicateShortname
          ? ['Mannschaft mit diesem Kürzel ist schon angelegt.']
          : null,
      });
      setErrors(teamForm, {
        path: ['id'],
        errors: duplicateId
          ? ['Mannschaft mit dieser Kennung ist schon angelegt.']
          : null,
      });

      if (duplicateName || duplicateShortname || duplicateId) {
        focus(teamForm, {
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
        updateTeam(team).then(() =>
          invalidateCache([{ type: 'collection', name: 'teams' }]),
        ),
        `${team.name} geändert.`,
      );
      endEdit();
    } else {
      await notify(
        createTeam(team).then(() =>
          invalidateCache([{ type: 'collection', name: 'teams' }]),
        ),
        `${team.name} angelegt`,
      );
      reset(teamForm, { initialInput: emptyTeam });
      focus(teamForm, { path: ['name'] });
    }
  }

  return (
    <div ref={topRef} className="space-y-4">
      <h2 className="font-semibold text-2xl">Mannschaften / Vereine</h2>
      <div className="mt-5">
        <div className="rounded-md bg-white shadow-sm sm:overflow-hidden">
          <button
            type="button"
            onClick={() => setFormOpen(!isFormOpen)}
            className="flex w-full items-center justify-between px-4 py-2 font-semibold"
          >
            <span>
              {editMode ? 'Mannschaft bearbeiten' : 'Neue Mannschaft'}
            </span>
            <ChevronDownIcon
              className={cn(
                'h-5 w-5 transition-transform',
                isFormOpen && 'rotate-180 transform',
              )}
            />
          </button>
          {isFormOpen && (
            <div>
              <Form of={teamForm} onSubmit={saveTeam}>
                <div className="space-y-4 p-4">
                  <FormField of={teamForm} path={['name']}>
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
                  <FormField of={teamForm} path={['shortname']}>
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
                  <FormField of={teamForm} path={['id']}>
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
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={teamForm.isSubmitting}
                  >
                    {teamForm.isSubmitting ? 'Speichern ...' : 'Speichern'}
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
              {teams.map((team) => (
                <tr key={team.id}>
                  <td className="whitespace-nowrap py-4 pr-3 pl-4 text-gray-500 text-sm">
                    {team.name}
                  </td>
                  <td className="hidden whitespace-nowrap px-3 py-4 text-gray-500 text-sm sm:table-cell">
                    {team.shortname}
                  </td>
                  <td className="pr-3 text-right">
                    <Button onClick={() => beginEdit(team)}>
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
