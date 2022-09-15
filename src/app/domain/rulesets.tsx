import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { ChevronDownIcon, PencilIcon } from '@heroicons/react/24/outline';

import Button from '@/components/button';
import TextField from '@/components/form/text-field';
import AppCard from '@/components/layout/app-card';
import TextareaField from '@/components/form/textarea-field';
import SelectField from '@/components/form/select-field';
import { trimProps } from '@/utils/trim-props';
import { classNames } from '@/utils/class-names';
import { Ruleset } from '@/model/domain/ruleset';
import { useRulesets } from '@/hooks/domain/use-rulesets';
import { tipRuleDescriptions } from '@/model/domain/calculators/calculate-tip-result';
import { matchRuleDescriptions } from '@/model/domain/calculators/calculate-match-results';
import { roundRuleDescriptions } from '@/model/domain/calculators/calculate-round-results';

const initialFormState: Ruleset = {
  id: '',
  name: '',
  description: '',
  tipRule: tipRuleDescriptions[0].name,
  matchRule: matchRuleDescriptions[0].name,
  roundRule: roundRuleDescriptions[0].name,
};

export default function RulesetsView() {
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<Ruleset>({
    defaultValues: initialFormState,
  });

  const { rulesets, createRuleset, updateRuleset } = useRulesets();
  const [isFormOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  function beginEdit(ruleset: Ruleset) {
    reset(ruleset);
    setEditMode(true);
    setFormOpen(true);
  }

  function endEdit() {
    reset(initialFormState);
    setEditMode(false);
    setFormOpen(false);
  }

  async function saveRuleset(ruleset: Ruleset) {
    ruleset = trimProps(ruleset);
    if (ruleset.id === '') {
      await toast.promise(createRuleset(ruleset), {
        loading: 'Speichern',
        success: (data) => `${data.name} angelegt.`,
        error: 'Hopply, das hat nicht geklappt.',
      });
    } else {
      await toast.promise(updateRuleset(ruleset), {
        loading: 'Speichern',
        success: (data) => `${data.name} geändert.`,
        error: 'Hopply, das hat nicht geklappt.',
      });
    }
    endEdit();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Regelwerke</h2>
      <div className="mt-5">
        <div className="shadow rounded-md bg-white">
          <button
            onClick={() => setFormOpen(!isFormOpen)}
            className="w-full flex items-center justify-between px-4 py-2 font-semibold"
          >
            <span>{editMode ? 'Regelwerk bearbeiten' : 'Neues Regelwerk'}</span>
            <ChevronDownIcon
              className={classNames(
                'h-5 w-5 transition-transform',
                isFormOpen && 'rotate-180 transform'
              )}
            />
          </button>
          {isFormOpen && (
            <div>
              <form noValidate onSubmit={handleSubmit(saveRuleset)}>
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
                          !rulesets.some((p) => p.name === name) ||
                          'Regelwerk mit diesem Namen ist schon angelegt.',
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
                  <Controller
                    control={control}
                    name="tipRule"
                    render={({ field: { value, onChange } }) => (
                      <SelectField
                        value={value}
                        onChange={onChange}
                        label="Tippregel"
                        options={tipRuleDescriptions}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="matchRule"
                    render={({ field: { value, onChange } }) => (
                      <SelectField
                        value={value}
                        onChange={onChange}
                        label="Spielregel"
                        options={matchRuleDescriptions}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="roundRule"
                    render={({ field: { value, onChange } }) => (
                      <SelectField
                        value={value}
                        onChange={onChange}
                        label="Rundenregel"
                        options={roundRuleDescriptions}
                      />
                    )}
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
                  className="w-12 pl-4 pr-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                >
                  Nr
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Name
                </th>
                <th scope="col" className="py-3.5 pl-3 sm:pl-6 lg:pl-8">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white pr-1">
              {[...rulesets]
                .sort((a, b) => Number(a.id) - Number(b.id))
                .map((ruleset) => (
                  <tr key={ruleset.id}>
                    <td className="whitespace-nowrap text-right pr-3 py-4 text-sm font-medium text-gray-900">
                      {ruleset.id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {ruleset.name}
                    </td>
                    <td className="text-right pr-3">
                      <Button onClick={() => beginEdit(ruleset)}>
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
