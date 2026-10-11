import { type Team, TeamSchema } from '@haus23/tipprunde-model';
import { cn } from 'cn';
import { ChevronDownIcon, PencilIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import * as v from 'valibot';
import Button from '#/components/button';
import TextField from '#/components/form/text-field';
import AppCard from '#/components/layout/app-card';
import { useTeams } from '#/hooks/master-data/use-teams';
import { invalidateCache } from '#/utils/invalidate-cache';
import { notify } from '#/utils/notify';
import { slug } from '#/utils/slug';

const emptyTeam: Team = { id: '', name: '', shortname: '' };

type TeamErrors = Partial<Record<keyof Team, string>>;

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <Button variant="primary" type="submit" disabled={pending}>
      {pending ? 'Speichern ...' : 'Speichern'}
    </Button>
  );
}

export default function TeamsView() {
  const { teams, createTeam, updateTeam } = useTeams();
  const [isFormOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [team, setTeam] = useState<Team>(emptyTeam);
  const [errors, setErrors] = useState<TeamErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const shortnameEditedRef = useRef(false);
  const idEditedRef = useRef(false);

  function beginEdit(team: Team) {
    setTeam(team);
    setErrors({});
    shortnameEditedRef.current = true;
    idEditedRef.current = true;
    setEditMode(true);
    setFormOpen(true);
  }

  function endEdit() {
    setTeam(emptyTeam);
    setErrors({});
    shortnameEditedRef.current = false;
    idEditedRef.current = false;
    setEditMode(false);
    setFormOpen(false);
  }

  function handleNameChange() {
    const name = team.name.trim();
    if (!editMode && name && !shortnameEditedRef.current) {
      setTeam((current) => ({ ...current, shortname: name }));
    }
  }

  function handleShortnameChange() {
    const sluggedName = slug(team.shortname);
    if (!editMode && sluggedName && !idEditedRef.current) {
      setTeam((current) => ({ ...current, id: sluggedName }));
    }
  }

  function focusField(name: keyof Team) {
    const field = formRef.current?.elements.namedItem(name);
    if (field instanceof HTMLElement) field.focus();
  }

  async function saveTeam(formData: FormData) {
    const input = {
      id: String(formData.get('id') ?? '').trim(),
      name: String(formData.get('name') ?? '').trim(),
      shortname: String(formData.get('shortname') ?? '').trim(),
    };
    const result = v.safeParse(TeamSchema, input);

    if (!result.success) {
      const nestedErrors = v.flatten(result.issues).nested;
      setErrors({
        id: nestedErrors?.id?.[0],
        name: nestedErrors?.name?.[0],
        shortname: nestedErrors?.shortname?.[0],
      });
      const firstField = result.issues[0]?.path?.[0]?.key;
      if (
        firstField === 'id' ||
        firstField === 'name' ||
        firstField === 'shortname'
      ) {
        focusField(firstField);
      }
      return;
    }

    if (!editMode) {
      const duplicateErrors: TeamErrors = {
        name: teams.some((item) => item.name === result.output.name)
          ? 'Mannschaft mit diesem Namen ist schon angelegt.'
          : undefined,
        shortname: teams.some(
          (item) => item.shortname === result.output.shortname,
        )
          ? 'Mannschaft mit diesem Kürzel ist schon angelegt.'
          : undefined,
        id: teams.some((item) => item.id === result.output.id)
          ? 'Mannschaft mit dieser Kennung ist schon angelegt.'
          : undefined,
      };
      const firstDuplicate = (['name', 'shortname', 'id'] as const).find(
        (name) => duplicateErrors[name],
      );
      if (firstDuplicate) {
        setErrors(duplicateErrors);
        focusField(firstDuplicate);
        return;
      }
    }

    setErrors({});
    if (editMode) {
      await notify(
        updateTeam(result.output).then(() =>
          invalidateCache([{ type: 'collection', name: 'teams' }]),
        ),
        `${result.output.name} geändert.`,
      );
      endEdit();
    } else {
      await notify(
        createTeam(result.output).then(() =>
          invalidateCache([{ type: 'collection', name: 'teams' }]),
        ),
        `${result.output.name} angelegt`,
      );
      setTeam(emptyTeam);
      shortnameEditedRef.current = false;
      idEditedRef.current = false;
      requestAnimationFrame(() => nameInputRef.current?.focus());
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
              className={cn(
                'h-5 w-5 transition-transform',
                isFormOpen && 'rotate-180 transform',
              )}
            />
          </button>
          {isFormOpen && (
            <div>
              <form ref={formRef} action={saveTeam} noValidate={true}>
                <div className="space-y-4 p-4">
                  <TextField
                    ref={nameInputRef}
                    autoFocus={true}
                    label="Name"
                    name="name"
                    required={true}
                    value={team.name}
                    error={errors.name}
                    onChange={(event) => {
                      setTeam((current) => ({
                        ...current,
                        name: event.target.value,
                      }));
                      setErrors({});
                    }}
                    onBlur={handleNameChange}
                  />
                  <TextField
                    label="Kürzel"
                    name="shortname"
                    required={true}
                    value={team.shortname}
                    error={errors.shortname}
                    onChange={(event) => {
                      shortnameEditedRef.current = true;
                      setTeam((current) => ({
                        ...current,
                        shortname: event.target.value,
                      }));
                      setErrors({});
                    }}
                    onBlur={handleShortnameChange}
                  />
                  <TextField
                    label="Kennung"
                    name="id"
                    required={true}
                    readOnly={editMode}
                    value={team.id}
                    error={errors.id}
                    onChange={(event) => {
                      idEditedRef.current = true;
                      setTeam((current) => ({
                        ...current,
                        id: event.target.value,
                      }));
                      setErrors({});
                    }}
                  />
                </div>
                <div className="space-x-4 bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <Button onClick={endEdit}>Abbrechen</Button>
                  <SaveButton />
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
