import { ChevronDownIcon, PencilIcon } from '@heroicons/react/24/outline';

import { League } from 'lib';

import Button from '@/components/button';
import TextField from '@/components/form/text-field';
import AppCard from '@/components/layout/app-card';
import { useForm } from 'react-hook-form';
import { slug } from '@/utils/slug';
import { trimProps } from '@/utils/trim-props';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { classNames } from '@/utils/class-names';
import { useLeagues } from '@/hooks/master-data/use-leagues';

export default function LeaguesView() {
  const {
    getValues,
    handleSubmit,
    register,
    reset,
    setFocus,
    setValue,
    formState: { dirtyFields, errors },
  } = useForm<League>({ defaultValues: { id: '' } });

  const { leagues, createLeague, updateLeague } = useLeagues();
  const [isFormOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  function beginEdit(league: League) {
    reset(league);
    setEditMode(true);
    setFormOpen(true);
  }

  function endEdit() {
    reset({ id: '' });
    setEditMode(false);
    setFormOpen(false);
  }

  function handleShortnameChange() {
    const sluggedName = slug(getValues('shortname'));
    if (!editMode && sluggedName && !dirtyFields.id) {
      setValue('id', sluggedName, { shouldValidate: true });
    }
  }

  async function saveLeague(league: League) {
    league = trimProps(league);
    if (league.id === '') {
      await toast.promise(createLeague(league), {
        loading: 'Speichern',
        success: `${league.name} angelegt.`,
        error: 'Hopply, das hat nicht geklappt.',
      });
      setFocus('name');
      reset();
    } else {
      await toast.promise(updateLeague(league), {
        loading: 'Speichern',
        success: `${league.name} geändert.`,
        error: 'Hopply, das hat nicht geklappt.',
      });
      endEdit();
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Ligen / Runden</h2>
      <div className="mt-5">
        <div className="shadow sm:overflow-hidden rounded-md bg-white">
          <button
            onClick={() => setFormOpen(!isFormOpen)}
            className="w-full flex items-center justify-between px-4 py-2 font-semibold"
          >
            <span>{editMode ? 'Liga bearbeiten' : 'Neue Liga'}</span>
            <ChevronDownIcon
              className={classNames(
                'h-5 w-5 transition-transform',
                isFormOpen && 'rotate-180 transform'
              )}
            />
          </button>
          {isFormOpen && (
            <div>
              <form noValidate onSubmit={handleSubmit(saveLeague)}>
                <div className="space-y-4 p-4">
                  <TextField
                    autoFocus
                    label="Name"
                    required
                    error={errors.name?.message}
                    {...register('name', {
                      required: true,
                      validate: {
                        uniqueName: (name) =>
                          editMode ||
                          !leagues.some((league) => league.name === name) ||
                          'Liga mit diesem Namen ist schon angelegt.',
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
                          !leagues.some((p) => p.shortname === shortname) ||
                          'Liga mit diesem Kürzel ist schon angelegt.',
                      },
                    })}
                  />
                  <TextField
                    label="Kennung"
                    required
                    disabled={editMode}
                    error={errors.id?.message}
                    {...register('id', {
                      required: true,
                      validate: {
                        uniqueId: (id) =>
                          editMode ||
                          !leagues.some((league) => league.id === id) ||
                          'Liga mit dieser Kennung ist schon angelegt.',
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
                  className="pl-4 pr-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="hidden sm:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
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
                  <td className="whitespace-nowrap pl-4 pr-3 py-4 text-sm text-gray-500">
                    {league.name}
                  </td>
                  <td className="hidden sm:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {league.shortname}
                  </td>
                  <td className="text-right pr-3">
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
