import { Controller, FieldValues, useForm } from 'react-hook-form';

import { useRules } from '@/hooks/domain/use-rules';
import { Championship } from '@/model/domain/championship';
import TextField from '@/components/form/text-field';

import { SelectField } from 'ui';

export default function ChampionshipCreateView() {
  const { rules } = useRules();

  const {
    control,
    getValues,
    handleSubmit,
    register,
    setValue,
    formState: { dirtyFields, errors },
  } = useForm<Championship>({
    defaultValues: {
      id: '',
      title: '',
      nr: 1,
      rulesId: rules.at(-1)?.id,
    },
  });

  function saveChampionship(championship: Championship) {}

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
                name="rulesId"
                options={rules}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
