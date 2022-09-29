import { Controller, FieldValues, useForm } from 'react-hook-form';

import { useRulesets } from '@/hooks/domain/use-rulesets';
import { Championship } from '@/model/domain/championship';
import TextField from '@/components/form/text-field';

import { SelectField } from 'ui';

type FormFelder = FieldValues & {
  id: string;
  title: string;
  nr: number;
  rulesetId: string;
};

export default function ChampionshipCreateView() {
  const { rulesets } = useRulesets();

  const {
    control,
    getValues,
    handleSubmit,
    register,
    setValue,
    formState: { dirtyFields, errors },
  } = useForm<FormFelder>({
    defaultValues: {
      id: '',
      title: '',
      nr: 1,
      rulesetId: rulesets.at(-1)?.id,
    },
  });

  function saveChampionship(championship: FormFelder) {}

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Neues Turnier</h2>
      <div className="mt-5">
        <div className="shadow rounded-md bg-white">
          <form onSubmit={handleSubmit(saveChampionship)} noValidate>
            <div className="space-y-4 p-4">
              <TextField label="Bezeichnung" {...register('title')} />
              <TextField label="Kennung" {...register('id')} />
              <TextField
                label="Nummer"
                type="number"
                min="1"
                {...register('nr')}
              />
              <SelectField
                label="Regelwerk"
                control={control}
                name="rulesetId"
                options={rulesets}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
