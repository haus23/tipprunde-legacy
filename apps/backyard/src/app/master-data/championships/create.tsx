import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { SelectField } from 'ui';
import { Championship } from 'lib';

import TextField from '@/components/form/text-field';
import Button from '@/components/button';

import { useRules } from '@/hooks/master-data/use-rules';
import { useChampionships } from '@/hooks/master-data/use-championships';
import { notify } from '@/utils/notify';

export default function ChampionshipsCreateView() {
  const { championships, createChampionship } = useChampionships();
  const { rules } = useRules();

  const lastNr = championships.reduce((max, c) => (c.nr > max ? c.nr : max), 0);

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
      name: '',
      nr: lastNr + 1,
      rulesId: rules[0].id,
      published: false,
      completed: false,
    },
  });

  const navigate = useNavigate();

  const handleTitleChange = () => {
    if (!dirtyFields.id) {
      const name = getValues('name');
      const stdPattern = /^([HRWE]).*(\d{2})\/?(\d{2})$/;
      const match = name.match(stdPattern);
      if (match) {
        const secondLetter = match[0].match(/[HR]/) ? 'r' : 'm';
        setValue(
          'id',
          `${match[1].toLowerCase() + secondLetter}${match[2] + match[3]}`,
          { shouldValidate: true }
        );
      }
    }
  };

  const saveChampionship: SubmitHandler<Championship> = async (
    championship
  ) => {
    await notify(
      createChampionship(championship),
      `${championship.name} angelegt.`
    );
    navigate('..');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Neues Turnier</h2>
      <div className="mt-5">
        <div className="shadow rounded-md bg-white">
          <form onSubmit={handleSubmit(saveChampionship)} noValidate>
            <div className="space-y-4 p-4">
              <TextField
                autoFocus
                label="Bezeichnung"
                placeholder="Hinrunde 2019/20 oder WM 2014"
                error={errors.name?.message}
                {...register('name', {
                  required: 'Pflichtfeld',
                  onBlur: handleTitleChange,
                })}
              />
              <TextField
                label="Kennung"
                placeholder="Eindeutige Kennung"
                error={errors.id?.message}
                {...register('id', {
                  required: 'Pflichtfeld',
                  pattern: {
                    value: /[a-z]{2}[0-9]{4}/,
                    message:
                      'Genau sechs Zeichen - zwei Kleinbuchstaben und dann vier Ziffern',
                  },
                  maxLength: {
                    value: 6,
                    message:
                      'Genau sechs Zeichen - zwei Kleinbuchstaben und dann vier Ziffern',
                  },
                  validate: {
                    uniqueSlug: (id) =>
                      !championships.some((c) => c.id === id) ||
                      'Turnier mit dieser Kennung existiert schon',
                  },
                })}
              />
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
            <div className="bg-gray-50 px-4 py-3 text-right sm:px-6 space-x-4">
              <Button primary type="submit">
                Speichern
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
