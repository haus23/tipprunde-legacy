import { ChevronDownIcon, PencilIcon } from '@heroicons/react/24/outline';
import {
  extraQuestionRuleDescriptions,
  matchRuleDescriptions,
  type RuleSet,
  roundRuleDescriptions,
  tipRuleDescriptions,
} from 'lib';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { SelectField } from 'ui-legacy';
import Button from '#/components/button';
import TextField from '#/components/form/text-field';
import TextareaField from '#/components/form/textarea-field';
import AppCard from '#/components/layout/app-card';
import { useRules } from '#/hooks/master-data/use-rules';
import { classNames } from '#/utils/class-names';
import { invalidateCache } from '#/utils/invalidate-cache';
import { slug } from '#/utils/slug';
import { trimProps } from '#/utils/trim-props';

const initialFormState: RuleSet = {
  id: '',
  name: '',
  description: '',
  tipRuleId: tipRuleDescriptions[0].id,
  matchRuleId: matchRuleDescriptions[0].id,
  roundRuleId: roundRuleDescriptions[0].id,
  extraQuestionsRuleId: extraQuestionRuleDescriptions[0].id,
};

export default function RulesView() {
  const {
    control,
    getValues,
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { dirtyFields, errors },
  } = useForm<RuleSet>({
    defaultValues: initialFormState,
  });

  const { rules, createRules, updateRules } = useRules();
  const [isFormOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  function beginEdit(rules: RuleSet) {
    reset(rules);
    setEditMode(true);
    setFormOpen(true);
  }

  function endEdit() {
    reset(initialFormState);
    setEditMode(false);
    setFormOpen(false);
  }

  async function saveRules(rules: RuleSet) {
    trimProps(rules);

    if (!editMode) {
      await toast.promise(
        createRules(rules).then(() =>
          invalidateCache([{ type: 'collection', name: 'rules' }]),
        ),
        {
          loading: 'Speichern',
          success: `${rules.name} angelegt.`,
          error: 'Hopply, das hat nicht geklappt.',
        },
      );
    } else {
      await toast.promise(
        updateRules(rules).then(() =>
          invalidateCache([{ type: 'collection', name: 'rules' }]),
        ),
        {
          loading: 'Speichern',
          success: `${rules.name} geändert.`,
          error: 'Hopply, das hat nicht geklappt.',
        },
      );
    }
    endEdit();
  }

  function handleNameChange() {
    const sluggedName = slug(getValues('name'));
    if (!editMode && sluggedName && !dirtyFields.id) {
      setValue('id', sluggedName, { shouldValidate: true });
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
              className={classNames(
                'h-5 w-5 transition-transform',
                isFormOpen && 'rotate-180 transform',
              )}
            />
          </button>
          {isFormOpen && (
            <div>
              <form noValidate onSubmit={handleSubmit(saveRules)}>
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
                          !rules.some((rules) => rules.name === name) ||
                          'Regelwerk mit diesem Namen ist schon angelegt.',
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
                          !rules.some((rules) => rules.id === id) ||
                          'Regelwerk mit dieser Kennung ist schon angelegt.',
                      },
                    })}
                  />
                  <TextareaField
                    label="Beschreibung"
                    required
                    rows={4}
                    error={errors.description?.message}
                    {...register('description', { required: true })}
                  />
                  <SelectField
                    label="Tippregel"
                    control={control}
                    name="tipRuleId"
                    options={tipRuleDescriptions}
                  />
                  <SelectField
                    control={control}
                    name="matchRuleId"
                    label="Spielregel"
                    options={matchRuleDescriptions}
                  />
                  <SelectField
                    control={control}
                    name="roundRuleId"
                    label="Rundenregel"
                    options={roundRuleDescriptions}
                  />
                  <SelectField
                    control={control}
                    name="extraQuestionsRuleId"
                    label="Zusatzfragen"
                    options={extraQuestionRuleDescriptions}
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
