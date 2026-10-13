import {
  Field,
  focus,
  getInput,
  isDirty,
  reset,
  setErrors,
  useForm,
} from '@formisch/react';
import { slugIdRegEx, type Team } from '@haus23/tipprunde-model';
import { useEffect } from 'react';
import * as v from 'valibot';
import TextField from '#/components/form/text-field';
import FormDialog from '#/components/form-dialog';
import { useTeams } from '#/hooks/master-data/use-teams';
import { invalidateCache } from '#/utils/invalidate-cache';
import { notify } from '#/utils/notify';
import { slug } from '#/utils/slug';

// Creates a team, or edits `team` when given. Self-contained, so it can also
// be opened from other places such as the match dialog.

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

type TeamDialogProps = {
  onOpenChange: (open: boolean) => void;
  onSaved?: (team: Team) => void;
  open: boolean;
  team?: Team;
};

export default function TeamDialog({
  onOpenChange,
  onSaved,
  open,
  team,
}: TeamDialogProps) {
  const { teams, createTeam, updateTeam } = useTeams();
  const editMode = team !== undefined;

  const teamForm = useForm({
    schema: TeamFormSchema,
    initialInput: emptyTeam,
  });

  useEffect(() => {
    if (open) reset(teamForm, { initialInput: team ?? emptyTeam });
  }, [open, team, teamForm]);

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

  async function saveTeam(data: Team) {
    if (!editMode) {
      const duplicateName = teams.some((item) => item.name === data.name);
      const duplicateShortname = teams.some(
        (item) => item.shortname === data.shortname,
      );
      const duplicateId = teams.some((item) => item.id === data.id);

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

    await notify(
      (editMode ? updateTeam(data) : createTeam(data)).then(() =>
        invalidateCache([{ type: 'collection', name: 'teams' }]),
      ),
      editMode ? `${data.name} geändert.` : `${data.name} angelegt.`,
    );
    onOpenChange(false);
    onSaved?.(data);
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      form={teamForm}
      onSubmit={saveTeam}
      title={editMode ? 'Mannschaft bearbeiten' : 'Neue Mannschaft'}
      submitLabel={editMode ? 'Speichern' : 'Anlegen'}
    >
      <Field of={teamForm} path={['name']}>
        {(field) => (
          <TextField
            {...field.props}
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
      </Field>
      <Field of={teamForm} path={['shortname']}>
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
      </Field>
      <Field of={teamForm} path={['id']}>
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
      </Field>
    </FormDialog>
  );
}
