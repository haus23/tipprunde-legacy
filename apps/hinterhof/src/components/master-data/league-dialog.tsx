import {
  Field,
  focus,
  getInput,
  isDirty,
  reset,
  setErrors,
  useForm,
} from '@formisch/react';
import { type League, slugIdRegEx } from '@haus23/tipprunde-model';
import { useEffect } from 'react';
import * as v from 'valibot';
import TextField from '#/components/form/text-field';
import FormDialog from '#/components/form-dialog';
import { useLeagues } from '#/hooks/master-data/use-leagues';
import { invalidateCache } from '#/utils/invalidate-cache';
import { notify } from '#/utils/notify';
import { slug } from '#/utils/slug';

// Creates a league, or edits `league` when given. Self-contained, so it can
// also be opened from other places such as the match dialog.

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

type LeagueDialogProps = {
  onOpenChange: (open: boolean) => void;
  onSaved?: (league: League) => void;
  open: boolean;
  league?: League;
};

export default function LeagueDialog({
  onOpenChange,
  onSaved,
  open,
  league,
}: LeagueDialogProps) {
  const { leagues, createLeague, updateLeague } = useLeagues();
  const editMode = league !== undefined;

  const leagueForm = useForm({
    schema: LeagueFormSchema,
    initialInput: emptyLeague,
  });

  useEffect(() => {
    if (open) reset(leagueForm, { initialInput: league ?? emptyLeague });
  }, [open, league, leagueForm]);

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

  async function saveLeague(data: League) {
    if (!editMode) {
      const duplicateName = leagues.some((item) => item.name === data.name);
      const duplicateShortname = leagues.some(
        (item) => item.shortname === data.shortname,
      );
      const duplicateId = leagues.some((item) => item.id === data.id);

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

    await notify(
      (editMode ? updateLeague(data) : createLeague(data)).then(() =>
        invalidateCache([{ type: 'collection', name: 'leagues' }]),
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
      form={leagueForm}
      onSubmit={saveLeague}
      title={editMode ? 'Liga bearbeiten' : 'Neue Liga'}
      submitLabel={editMode ? 'Speichern' : 'Anlegen'}
    >
      <Field of={leagueForm} path={['name']}>
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
      <Field of={leagueForm} path={['shortname']}>
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
      <Field of={leagueForm} path={['id']}>
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
