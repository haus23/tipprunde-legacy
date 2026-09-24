import { ChevronDownIcon, PencilIcon } from '@heroicons/react/24/outline';
import type { Member } from 'lib';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Button from '#/components/button';
import TextField from '#/components/form/text-field';
import AppCard from '#/components/layout/app-card';
import { usePlayers } from '#/hooks/master-data/use-players';
import { classNames } from '#/utils/class-names';
import { clearCache } from '#/utils/clear-cache';
import { emailValidator } from '#/utils/email-validator';
import { slug } from '#/utils/slug';
import { trimProps } from '#/utils/trim-props';

export default function PlayersView() {
  const {
    getValues,
    handleSubmit,
    register,
    reset,
    setFocus,
    setValue,
    formState: { dirtyFields, errors },
  } = useForm<Member>({ defaultValues: { id: '' } });

  const { players, createPlayer, updatePlayer } = usePlayers();
  const [isFormOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  function beginEdit(player: Member) {
    reset(player);
    setEditMode(true);
    setFormOpen(true);
  }

  function endEdit() {
    reset({ id: '' });
    setEditMode(false);
    setFormOpen(false);
  }

  function handleNameChange() {
    const sluggedName = slug(getValues('name'));
    if (!editMode && sluggedName && !dirtyFields.id) {
      setValue('id', sluggedName, { shouldValidate: true });
    }
  }

  async function savePlayer(player: Member) {
    trimProps(player);
    if (!editMode) {
      await toast.promise(createPlayer(player), {
        loading: 'Speichern',
        success: `${player.name} angelegt.`,
        error: 'Hopply, das hat nicht geklappt.',
      });
      setFocus('name');
      reset();
    } else {
      await toast.promise(updatePlayer(player), {
        loading: 'Speichern',
        success: `${player.name} geändert.`,
        error: 'Hopply, das hat nicht geklappt.',
      });
      endEdit();
    }
    clearCache('accounts', 'Spielerdaten');
  }

  return (
    <div className="space-y-4">
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
              className={classNames(
                'h-5 w-5 transition-transform',
                isFormOpen && 'rotate-180 transform',
              )}
            />
          </button>
          {isFormOpen && (
            <div>
              <form noValidate onSubmit={handleSubmit(savePlayer)}>
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
                          !players.some((player) => player.name === name) ||
                          'Spieler mit diesem Namen ist schon angelegt.',
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
                          !players.some((player) => player.id === id) ||
                          'Spieler mit dieser Kennung ist schon angelegt.',
                      },
                    })}
                  />
                  <TextField
                    label="Email"
                    error={errors.email?.message}
                    {...register('email', {
                      pattern: {
                        value: emailValidator,
                        message: 'Keine korrekte Email-Adresse.',
                      },
                    })}
                  />
                </div>
                <div className="space-x-4 bg-gray-50 px-4 py-3 text-right sm:px-6">
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
