import {
  Form,
  Field as FormField,
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
  tipRules,
} from '@haus23/tipprunde-model';
import { cn } from 'cn';
import { ChevronDownIcon, PencilIcon } from 'lucide-react';
import { useState } from 'react';
import * as v from 'valibot';
import Button from '#/components/button';
import Select from '#/components/form/select';
import TextField from '#/components/form/text-field';
import TextareaField from '#/components/form/textarea-field';
import AppCard from '#/components/layout/app-card';
import { useRules } from '#/hooks/master-data/use-rules';
import { invalidateCache } from '#/utils/invalidate-cache';
import { notify } from '#/utils/notify';
import { slug } from '#/utils/slug';

const requiredMessage = 'Bitte ausfüllen.';

const RulesFormSchema = v.object({
  name: v.pipe(v.string(), v.trim(), v.nonEmpty(requiredMessage)),
  id: v.pipe(v.string(), v.trim(), v.nonEmpty(requiredMessage)),
  description: v.pipe(v.string(), v.trim(), v.nonEmpty(requiredMessage)),
  tipRuleId: RuleSetSchema.entries.tipRuleId,
  matchRuleId: RuleSetSchema.entries.matchRuleId,
  roundRuleId: RuleSetSchema.entries.roundRuleId,
  extraQuestionsRuleId: RuleSetSchema.entries.extraQuestionsRuleId,
});

const initialFormState: RuleSet = {
  id: '',
  name: '',
  description: '',
  tipRuleId: tipRules[0].id,
  matchRuleId: matchRules[0].id,
  roundRuleId: roundRules[0].id,
  extraQuestionsRuleId: extraQuestionRules[0].id,
};

export default function RulesView() {
  const rulesForm = useForm({
    schema: RulesFormSchema,
    initialInput: initialFormState,
  });

  const { rules, createRules, updateRules } = useRules();
  const [isFormOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  function beginEdit(rules: RuleSet) {
    reset(rulesForm, { initialInput: rules });
    setEditMode(true);
    setFormOpen(true);
  }

  function endEdit() {
    reset(rulesForm, { initialInput: initialFormState });
    setEditMode(false);
    setFormOpen(false);
  }

  async function saveRules(ruleSet: RuleSet) {
    if (!editMode) {
      const duplicateName = rules.some((item) => item.name === ruleSet.name);
      const duplicateId = rules.some((item) => item.id === ruleSet.id);

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

      await notify(
        createRules(ruleSet).then(() =>
          invalidateCache([{ type: 'collection', name: 'rules' }]),
        ),
        `${ruleSet.name} angelegt.`,
      );
    } else {
      await notify(
        updateRules(ruleSet).then(() =>
          invalidateCache([{ type: 'collection', name: 'rules' }]),
        ),
        `${ruleSet.name} geändert.`,
      );
    }
    endEdit();
  }

  function handleNameChange() {
    const sluggedName = slug(getInput(rulesForm, { path: ['name'] }) ?? '');
    if (!editMode && sluggedName && !isDirty(rulesForm, { path: ['id'] })) {
      reset(rulesForm, { path: ['id'], initialInput: sluggedName });
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-2xl">Regelwerke</h2>
      <div className="mt-5">
        <div className="rounded-md bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setFormOpen(!isFormOpen)}
            className="flex w-full items-center justify-between px-4 py-2 font-semibold"
          >
            <span>{editMode ? 'Regelwerk bearbeiten' : 'Neues Regelwerk'}</span>
            <ChevronDownIcon
              className={cn(
                'h-5 w-5 transition-transform',
                isFormOpen && 'rotate-180 transform',
              )}
            />
          </button>
          {isFormOpen && (
            <div>
              <Form of={rulesForm} onSubmit={saveRules}>
                <div className="space-y-4 p-4">
                  <FormField of={rulesForm} path={['name']}>
                    {(field) => (
                      <TextField
                        {...field.props}
                        autoFocus={true}
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
                  </FormField>
                  <FormField of={rulesForm} path={['id']}>
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
                  </FormField>
                  <FormField of={rulesForm} path={['description']}>
                    {(field) => (
                      <TextareaField
                        {...field.props}
                        label="Beschreibung"
                        required={true}
                        rows={4}
                        value={field.input ?? ''}
                        error={field.errors?.[0]}
                      />
                    )}
                  </FormField>
                  <FormField of={rulesForm} path={['tipRuleId']}>
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
                  </FormField>
                  <FormField of={rulesForm} path={['matchRuleId']}>
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
                  </FormField>
                  <FormField of={rulesForm} path={['roundRuleId']}>
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
                  </FormField>
                  <FormField of={rulesForm} path={['extraQuestionsRuleId']}>
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
                  </FormField>
                </div>
                <div className="space-x-4 bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <Button onClick={endEdit}>Abbrechen</Button>
                  <Button variant="primary" type="submit">
                    Speichern
                  </Button>
                </div>
              </Form>
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
                  Kennung
                </th>
                <th scope="col" className="py-3.5 pl-3 sm:pl-6 lg:pl-8">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white pr-1">
              {rules.map((rules) => (
                <tr key={rules.id}>
                  <td className="whitespace-nowrap px-3 py-4 text-gray-500 text-sm">
                    {rules.name}
                  </td>
                  <td className="hidden text-ellipsis px-3 py-4 text-gray-500 text-sm sm:table-cell">
                    {rules.description}
                  </td>
                  <td className="pr-3 text-right">
                    <Button onClick={() => beginEdit(rules)}>
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
