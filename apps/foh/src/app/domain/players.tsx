import { ChevronDownIcon, PencilIcon } from '@heroicons/react/24/outline';

import Button from '@/components/button';
import TextField from '@/components/form/text-field';
import AppCard from '@/components/layout/app-card';
import { usePlayers } from '@/hooks/domain/use-players';
import { useForm } from 'react-hook-form';
import { Player } from '@/model/domain/player';
import { slug } from '@/utils/slug';
import { emailValidator } from '@/utils/email-validator';
import { trimProps } from '@/utils/trim-props';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { classNames } from '@/utils/class-names';

export default function PlayersView() {
  const {
    getValues,
    handleSubmit,
    register,
    reset,
    setFocus,
    setValue,
    formState: { dirtyFields, errors },
  } = useForm<Player>({ defaultValues: { id: '' } });

  const { players, createPlayer, updatePlayer } = usePlayers();
  const [isFormOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  function beginEdit(player: Player) {
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

  async function savePlayer(player: Player) {
    player = trimProps(player);
    if (player.id === '') {
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
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Spieler</h2>
      <div className="mt-5">
        <div className="shadow sm:overflow-hidden rounded-md bg-white">
          <button
            onClick={() => setFormOpen(!isFormOpen)}
            className="w-full flex items-center justify-between px-4 py-2 font-semibold"
          >
            <span>{editMode ? 'Spieler bearbeiten' : 'Neuer Spieler'}</span>
            <ChevronDownIcon
              className={classNames(
                'h-5 w-5 transition-transform',
                isFormOpen && 'rotate-180 transform'
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
                  className="hidden sm:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:pr-6 lg:pr-8"
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
                  <td className="whitespace-nowrap pl-4 pr-3 py-4 text-sm text-gray-500">
                    {p.name}
                  </td>
                  <td className="hidden sm:table-cell whitespace-nowrap py-4 pl-3 pr-4 text-sm text-gray-500 sm:pr-6 lg:pr-8">
                    {p.email}
                  </td>
                  <td className="text-right pr-3">
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
