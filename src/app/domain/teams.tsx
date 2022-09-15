import { ChevronDownIcon, PencilIcon } from '@heroicons/react/24/outline';

import Button from '@/components/button';
import TextField from '@/components/form/text-field';
import AppCard from '@/components/layout/app-card';
import { useForm } from 'react-hook-form';
import { slug } from '@/utils/slug';
import { trimProps } from '@/utils/trim-props';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { classNames } from '@/utils/class-names';
import { League } from '@/model/domain/league';
import { useLeagues } from '@/hooks/domain/use-leagues';
import { Team } from '@/model/domain/team';
import { useTeams } from '@/hooks/domain/use-teams';

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
    if (!editMode && sluggedName && !dirtyFields.slug) {
      setValue('slug', sluggedName, { shouldValidate: true });
    }
  }

  async function saveTeam(team: Team) {
    team = trimProps(team);
    if (team.id === '') {
      await toast.promise(createTeam(team), {
        loading: 'Speichern',
        success: (data) => `${data.name} angelegt.`,
        error: 'Hopply, das hat nicht geklappt.',
      });
      setFocus('name');
      reset();
    } else {
      await toast.promise(updateTeam(team), {
        loading: 'Speichern',
        success: (data) => `${data.name} geändert.`,
        error: 'Hopply, das hat nicht geklappt.',
      });
      endEdit();
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Mannschaften / Vereine</h2>
      <div className="mt-5">
        <div className="shadow sm:overflow-hidden rounded-md bg-white">
          <button
            onClick={() => setFormOpen(!isFormOpen)}
            className="w-full flex items-center justify-between px-4 py-2 font-semibold"
          >
            <span>
              {editMode ? 'Mannschaft bearbeiten' : 'Neue Mannschaft'}
            </span>
            <ChevronDownIcon
              className={classNames(
                'h-5 w-5 transition-transform',
                isFormOpen && 'rotate-180 transform'
              )}
            />
          </button>
          {isFormOpen && (
            <div>
              <form noValidate onSubmit={handleSubmit(saveTeam)}>
                <div className="space-y-4 p-4">
                  <TextField
                    autoFocus
                    label="Name"
                    required
                    error={errors.name?.message}
                    {...register('name', {
                      required: true,
                      onBlur: handleNameChange,
                      validate: {
                        uniqueName: (name) =>
                          editMode ||
                          !teams.some((p) => p.name === name) ||
                          'Mannschaft mit diesem Namen ist schon angelegt.',
                      },
                    })}
                  />
                  <TextField
                    label="Kürzel"
                    required
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
                    required
                    error={errors.slug?.message}
                    {...register('slug', {
                      required: true,
                      validate: {
                        uniqueSlug: (slug) =>
                          editMode ||
                          !teams.some((p) => p.slug === slug) ||
                          'Mannschaft mit dieser Kennung ist schon angelegt.',
                      },
                    })}
                  />
                </div>
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6 space-x-4">
                  <Button onClick={endEdit}>Abbrechen</Button>
                  <Button primary type="submit">
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
                  className="w-12 pl-4 pr-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                >
                  Nr
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="hidden sm:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Kürzel
                </th>
                <th
                  scope="col"
                  className="hidden sm:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:pr-6 lg:pr-8"
                >
                  Kennung
                </th>
                <th scope="col" className="py-3.5 pl-3 sm:pl-6 lg:pl-8">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white pr-1">
              {[...teams]
                .sort((a, b) => Number(a.id) - Number(b.id))
                .map((team) => (
                  <tr key={team.id}>
                    <td className="whitespace-nowrap text-right pr-3 py-4 text-sm font-medium text-gray-900">
                      {team.id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {team.name}
                    </td>
                    <td className="hidden sm:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {team.shortname}
                    </td>
                    <td className="hidden sm:table-cell whitespace-nowrap py-4 pl-3 pr-4 text-sm text-gray-500 sm:pr-6 lg:pr-8">
                      {team.slug}
                    </td>
                    <td className="text-right pr-3">
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
