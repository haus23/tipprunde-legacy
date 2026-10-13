import {
  Field,
  focus,
  getInput,
  isDirty,
  reset,
  setErrors,
  useForm,
} from '@formisch/react';
import { type Member, slugIdRegEx } from '@haus23/tipprunde-model';
import { useEffect } from 'react';
import * as v from 'valibot';
import TextField from '#/components/form/text-field';
import FormDialog from '#/components/form-dialog';
import { usePlayers } from '#/hooks/master-data/use-players';
import { emailValidator } from '#/utils/email-validator';
import { invalidateCache } from '#/utils/invalidate-cache';
import { notify } from '#/utils/notify';
import { slug } from '#/utils/slug';

// Creates a player, or edits `player` when given. Self-contained, so it can
// also be opened from other places.

const requiredMessage = 'Bitte ausfüllen.';

const PlayerFormSchema = v.object({
  name: v.pipe(v.string(), v.trim(), v.nonEmpty(requiredMessage)),
  id: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty(requiredMessage),
    v.regex(slugIdRegEx, 'Nur Kleinbuchstaben, Ziffern und Bindestriche.'),
  ),
  email: v.pipe(
    v.string(),
    v.trim(),
    v.check(
      (email) => email === '' || emailValidator.test(email),
      'Keine korrekte Email-Adresse.',
    ),
  ),
});

const emptyPlayer = { id: '', name: '', email: '' };

type PlayerDialogProps = {
  onOpenChange: (open: boolean) => void;
  onSaved?: (player: Member) => void;
  open: boolean;
  player?: Member;
};

export default function PlayerDialog({
  onOpenChange,
  onSaved,
  open,
  player,
}: PlayerDialogProps) {
  const { players, createPlayer, updatePlayer } = usePlayers();
  const editMode = player !== undefined;

  const playerForm = useForm({
    schema: PlayerFormSchema,
    initialInput: emptyPlayer,
  });

  useEffect(() => {
    if (open) {
      reset(playerForm, {
        initialInput: player
          ? { ...player, email: player.email ?? '' }
          : emptyPlayer,
      });
    }
  }, [open, player, playerForm]);

  function handleNameChange() {
    const sluggedName = slug(getInput(playerForm, { path: ['name'] }) ?? '');
    if (!editMode && sluggedName && !isDirty(playerForm, { path: ['id'] })) {
      reset(playerForm, { path: ['id'], initialInput: sluggedName });
    }
  }

  async function savePlayer(data: Member) {
    if (!editMode) {
      const duplicateName = players.some((item) => item.name === data.name);
      const duplicateId = players.some((item) => item.id === data.id);

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
    }

    await notify(
      (editMode ? updatePlayer(data) : createPlayer(data)).then(() =>
        invalidateCache([{ type: 'collection', name: 'accounts' }]),
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
      form={playerForm}
      onSubmit={savePlayer}
      title={editMode ? 'Spieler bearbeiten' : 'Neuer Spieler'}
      submitLabel={editMode ? 'Speichern' : 'Anlegen'}
    >
      <Field of={playerForm} path={['name']}>
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
      <Field of={playerForm} path={['id']}>
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
      <Field of={playerForm} path={['email']}>
        {(field) => (
          <TextField
            {...field.props}
            label="Email"
            value={field.input ?? ''}
            error={field.errors?.[0]}
          />
        )}
      </Field>
    </FormDialog>
  );
}
