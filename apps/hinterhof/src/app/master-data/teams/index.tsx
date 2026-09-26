import { ChevronDownIcon, PencilIcon } from '@heroicons/react/24/outline';
import type { Team } from 'lib';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Button from '#/components/button';
import TextField from '#/components/form/text-field';
import AppCard from '#/components/layout/app-card';
import { useTeams } from '#/hooks/master-data/use-teams';
import { classNames } from '#/utils/class-names';
import { invalidateCache } from '#/utils/invalidate-cache';
import { slug } from '#/utils/slug';
import { trimProps } from '#/utils/trim-props';

export default function TeamsView() {
  const {
    getValues,
    handleSubmit,
    register,
    reset,
    setFocus,
    setValue,
    formState: { dirtyFields, errors },
  } = useForm<Team>({ defaultValues: { id: '' } });

  const { teams, createTeam, updateTeam } = useTeams();
  const [isFormOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  function beginEdit(team: Team) {
    reset(team);
    setEditMode(true);
    setFormOpen(true);
  }

  function endEdit() {
    reset({ id: '' });
    setEditMode(false);
    setFormOpen(false);
  }

  function handleNameChange() {
    const name = getValues('name').trim();
    if (!editMode && name && !dirtyFields.shortname) {
      setValue('shortname', name, { shouldValidate: true });
    }
  }

  function handleShortnameChange() {
    const sluggedName = slug(getValues('shortname'));
    if (!editMode && sluggedName && !dirtyFields.id) {
      setValue('id', sluggedName, { shouldValidate: true });
    }
  }

  async function saveTeam(team: Team) {
    trimProps(team);
    if (editMode) {
      await toast.promise(
        updateTeam(team).then(() =>
          invalidateCache([{ type: 'collection', name: 'teams' }]),
        ),
        {
          loading: 'Speichern',
          success: `${team.name} geändert.`,
          error: 'Hopply, das hat nicht geklappt.',
        },
      );
      endEdit();
    } else {
      await toast.promise(
        createTeam(team).then(() =>
          invalidateCache([{ type: 'collection', name: 'teams' }]),
        ),
        {
          loading: 'Speichern',
          success: `${team.name} angelegt`,
          error: 'Hopply, das hat nicht geklappt.',
        },
      );
      setFocus('name');
      reset();
    }
  }

  return (
    <div className="space-y-4">
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
              className={classNames(
                'h-5 w-5 transition-transform',
                isFormOpen && 'rotate-180 transform',
              )}
            />
          </button>
          {isFormOpen && (
            <div>
              <form noValidate={true} onSubmit={handleSubmit(saveTeam)}>
                <div className="space-y-4 p-4">
                  <TextField
                    autoFocus={true}
                    label="Name"
                    required={true}
                    error={errors.name?.message}
                    {...register('name', {
                      required: true,
                      onBlur: handleNameChange,
                      validate: {
                        uniqueName: (name) =>
                          editMode ||
                          !teams.some((team) => team.name === name) ||
                          'Mannschaft mit diesem Namen ist schon angelegt.',
                      },
                    })}
                  />
                  <TextField
                    label="Kürzel"
                    required={true}
                    error={errors.shortname?.message}
                    {...register('shortname', {
                      required: true,
                      onBlur: handleShortnameChange,
                      validate: {
                        uniqueName: (shortname) =>
                          editMode ||
                          !teams.some((p) => p.shortname === shortname) ||
                          'Mannschaft mit diesem Kürzel ist schon angelegt.',
                      },
                    })}
                  />
                  <TextField
                    label="Kennung"
                    required={true}
                    disabled={editMode}
                    error={errors.id?.message}
                    {...register('id', {
                      required: true,
                      validate: {
                        uniqueId: (id) =>
                          editMode ||
                          !teams.some((team) => team.id === id) ||
                          'Mannschaft mit dieser Kennung ist schon angelegt.',
                      },
                    })}
                  />
                </div>
                <div className="space-x-4 bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <Button onClick={endEdit}>Abbrechen</Button>
                  <Button primary={true} type="submit">
                    Speichern
                  </Button>
                </div>
              </form>
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
