import {
  Field,
  focus,
  getInput,
  isDirty,
  reset,
  setErrors,
  useForm,
} from '@formisch/react';
import {
  extraQuestionRules,
  matchRules,
  type RuleSet,
  RuleSetSchema,
  roundRules,
  slugIdRegEx,
  tipRules,
} from '@haus23/tipprunde-model';
import { useEffect } from 'react';
import * as v from 'valibot';
import Select from '#/components/form/select';
import TextField from '#/components/form/text-field';
import TextareaField from '#/components/form/textarea-field';
import FormDialog from '#/components/form-dialog';
import { useRules } from '#/hooks/master-data/use-rules';
import { invalidateCache } from '#/utils/invalidate-cache';
import { notify } from '#/utils/notify';
import { slug } from '#/utils/slug';

// Creates a rule set, or edits `ruleSet` when given. Self-contained, so it can
// also be opened from other places.

const requiredMessage = 'Bitte ausfüllen.';

const RulesFormSchema = v.object({
  name: v.pipe(v.string(), v.trim(), v.nonEmpty(requiredMessage)),
  id: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty(requiredMessage),
    v.regex(slugIdRegEx, 'Nur Kleinbuchstaben, Ziffern und Bindestriche.'),
  ),
  description: v.pipe(v.string(), v.trim(), v.nonEmpty(requiredMessage)),
  tipRuleId: RuleSetSchema.entries.tipRuleId,
  matchRuleId: RuleSetSchema.entries.matchRuleId,
  roundRuleId: RuleSetSchema.entries.roundRuleId,
  extraQuestionsRuleId: RuleSetSchema.entries.extraQuestionsRuleId,
});

const emptyRuleSet: RuleSet = {
  id: '',
  name: '',
  description: '',
  tipRuleId: tipRules[0].id,
  matchRuleId: matchRules[0].id,
  roundRuleId: roundRules[0].id,
  extraQuestionsRuleId: extraQuestionRules[0].id,
};

type RulesDialogProps = {
  onOpenChange: (open: boolean) => void;
  onSaved?: (ruleSet: RuleSet) => void;
  open: boolean;
  ruleSet?: RuleSet;
};

export default function RulesDialog({
  onOpenChange,
  onSaved,
  open,
  ruleSet,
}: RulesDialogProps) {
  const { rules, createRules, updateRules } = useRules();
  const editMode = ruleSet !== undefined;

  const rulesForm = useForm({
    schema: RulesFormSchema,
    initialInput: emptyRuleSet,
  });

  useEffect(() => {
    if (open) reset(rulesForm, { initialInput: ruleSet ?? emptyRuleSet });
  }, [open, ruleSet, rulesForm]);

  function handleNameChange() {
    const sluggedName = slug(getInput(rulesForm, { path: ['name'] }) ?? '');
    if (!editMode && sluggedName && !isDirty(rulesForm, { path: ['id'] })) {
      reset(rulesForm, { path: ['id'], initialInput: sluggedName });
    }
  }

  async function saveRules(data: RuleSet) {
    if (!editMode) {
      const duplicateName = rules.some((item) => item.name === data.name);
      const duplicateId = rules.some((item) => item.id === data.id);

      setErrors(rulesForm, {
        path: ['name'],
        errors: duplicateName
          ? ['Regelwerk mit diesem Namen ist schon angelegt.']
          : null,
      });
      setErrors(rulesForm, {
        path: ['id'],
        errors: duplicateId
          ? ['Regelwerk mit dieser Kennung ist schon angelegt.']
          : null,
      });

      if (duplicateName || duplicateId) {
        focus(rulesForm, { path: duplicateName ? ['name'] : ['id'] });
        return;
      }
    }

    await notify(
      (editMode ? updateRules(data) : createRules(data)).then(() =>
        invalidateCache([{ type: 'collection', name: 'rules' }]),
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
      form={rulesForm}
      onSubmit={saveRules}
      title={editMode ? 'Regelwerk bearbeiten' : 'Neues Regelwerk'}
      submitLabel={editMode ? 'Speichern' : 'Anlegen'}
    >
      <Field of={rulesForm} path={['name']}>
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
      <Field of={rulesForm} path={['id']}>
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
      <Field of={rulesForm} path={['description']}>
        {(field) => (
          <TextareaField
            {...field.props}
            label="Beschreibung"
            required={true}
            rows={3}
            value={field.input ?? ''}
            error={field.errors?.[0]}
          />
        )}
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field of={rulesForm} path={['tipRuleId']}>
          {(field) => (
            <Select
              label="Tippregel"
              name={field.props.name}
              value={field.input ?? ''}
              onValueChange={field.onChange}
              onBlur={field.props.onBlur}
              options={tipRules}
            />
          )}
        </Field>
        <Field of={rulesForm} path={['matchRuleId']}>
          {(field) => (
            <Select
              label="Spielregel"
              name={field.props.name}
              value={field.input ?? ''}
              onValueChange={field.onChange}
              onBlur={field.props.onBlur}
              options={matchRules}
            />
          )}
        </Field>
        <Field of={rulesForm} path={['roundRuleId']}>
          {(field) => (
            <Select
              label="Rundenregel"
              name={field.props.name}
              value={field.input ?? ''}
              onValueChange={field.onChange}
              onBlur={field.props.onBlur}
              options={roundRules}
            />
          )}
        </Field>
        <Field of={rulesForm} path={['extraQuestionsRuleId']}>
          {(field) => (
            <Select
              label="Zusatzfragen"
              name={field.props.name}
              value={field.input ?? ''}
              onValueChange={field.onChange}
              onBlur={field.props.onBlur}
              options={extraQuestionRules}
            />
          )}
        </Field>
      </div>
    </FormDialog>
  );
}
