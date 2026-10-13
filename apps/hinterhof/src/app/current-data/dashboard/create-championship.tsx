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
  type Championship,
  championshipIdRegEx,
} from '@haus23/tipprunde-model';
import { useNavigate } from 'react-router';
import * as v from 'valibot';
import Button from '#/components/button';
import Select from '#/components/form/select';
import TextField from '#/components/form/text-field';

import { useChampionships } from '#/hooks/master-data/use-championships';
import { useRules } from '#/hooks/master-data/use-rules';
import { invalidateCache } from '#/utils/invalidate-cache';
import { notify } from '#/utils/notify';

const requiredMessage = 'Bitte ausfüllen.';
const idMessage =
  'Genau sechs Zeichen - zwei Kleinbuchstaben und dann vier Ziffern.';
const nrMessage = 'Bitte eine ganze Zahl ab 1 eingeben.';

const ChampionshipFormSchema = v.object({
  name: v.pipe(v.string(), v.trim(), v.nonEmpty(requiredMessage)),
  id: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty(requiredMessage),
    v.regex(championshipIdRegEx, idMessage),
  ),
  nr: v.pipe(
    v.number(nrMessage),
    v.integer(nrMessage),
    v.minValue(1, nrMessage),
  ),
  rulesId: v.string(),
  published: v.boolean(),
  extraPointsPublished: v.boolean(),
  completed: v.boolean(),
});

// Derives the id from standard names such as "Hinrunde 2019/20" or "WM 2014".
function championshipIdFromName(name: string) {
  const match = name.match(/^([HRWE]).*(\d{2})\/?(\d{2})$/);
  if (!match) return undefined;
  const secondLetter = match[0].match(/[HR]/) ? 'r' : 'm';
  return `${match[1].toLowerCase() + secondLetter}${match[2] + match[3]}`;
}

export default function CreateChampionshipView() {
  const { championships, createChampionship } = useChampionships();
  const { rules } = useRules();

  const lastNr = championships.reduce((max, c) => (c.nr > max ? c.nr : max), 0);

  const championshipForm = useForm({
    schema: ChampionshipFormSchema,
    initialInput: {
      id: '',
      name: '',
      nr: lastNr + 1,
      rulesId: rules[0].id,
      published: false,
      extraPointsPublished: false,
      completed: false,
    },
  });

  const navigate = useNavigate();

  function handleNameChange() {
    if (isDirty(championshipForm, { path: ['id'] })) return;
    const id = championshipIdFromName(
      (getInput(championshipForm, { path: ['name'] }) ?? '').trim(),
    );
    if (id) {
      reset(championshipForm, { path: ['id'], initialInput: id });
    }
  }

  async function saveChampionship(championship: Championship) {
    if (championships.some((c) => c.id === championship.id)) {
      setErrors(championshipForm, {
        path: ['id'],
        errors: ['Turnier mit dieser Kennung existiert schon.'],
      });
      focus(championshipForm, { path: ['id'] });
      return;
    }

    await notify(
      createChampionship(championship).then(() =>
        invalidateCache([{ type: 'championships' }]),
      ),
      `${championship.name} angelegt.`,
    );
    navigate('../turnier');
  }

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-2xl">Neues Turnier</h2>
      <div className="mt-5">
        <div className="rounded-md bg-white shadow-sm">
          <Form of={championshipForm} onSubmit={saveChampionship}>
            <div className="space-y-4 p-4">
              <FormField of={championshipForm} path={['name']}>
                {(field) => (
                  <TextField
                    {...field.props}
                    autoFocus={true}
                    label="Bezeichnung"
                    placeholder="Hinrunde 2019/20 oder WM 2014"
                    value={field.input ?? ''}
                    error={field.errors?.[0]}
                    onBlur={() => {
                      field.props.onBlur();
                      handleNameChange();
                    }}
                  />
                )}
              </FormField>
              <FormField of={championshipForm} path={['id']}>
                {(field) => (
                  <TextField
                    {...field.props}
                    label="Kennung"
                    placeholder="Eindeutige Kennung"
                    value={field.input ?? ''}
                    error={field.errors?.[0]}
                  />
                )}
              </FormField>
              <FormField of={championshipForm} path={['nr']}>
                {(field) => (
                  <TextField
                    {...field.props}
                    label="Nummer"
                    type="number"
                    min="1"
                    value={
                      field.input === undefined || Number.isNaN(field.input)
                        ? ''
                        : field.input
                    }
                    error={field.errors?.[0]}
                    onChange={(event) =>
                      field.onChange(event.target.valueAsNumber)
                    }
                  />
                )}
              </FormField>
              <FormField of={championshipForm} path={['rulesId']}>
                {(field) => (
                  <Select
                    label="Regelwerk"
                    name={field.props.name}
                    value={field.input ?? ''}
                    onValueChange={field.onChange}
                    onBlur={field.props.onBlur}
                    options={rules}
                  />
                )}
              </FormField>
            </div>
            <div className="space-x-4 bg-gray-50 px-4 py-3 text-right sm:px-6">
              <Button variant="primary" type="submit">
                Speichern
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
