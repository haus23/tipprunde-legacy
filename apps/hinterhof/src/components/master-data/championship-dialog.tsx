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
  type Championship,
  championshipIdRegEx,
} from '@haus23/tipprunde-model';
import { useEffect } from 'react';
import * as v from 'valibot';
import Select from '#/components/form/select';
import TextField from '#/components/form/text-field';
import FormDialog from '#/components/form-dialog';
import { useChampionships } from '#/hooks/master-data/use-championships';
import { useRules } from '#/hooks/master-data/use-rules';
import { invalidateCache } from '#/utils/invalidate-cache';
import { notify } from '#/utils/notify';

// Creates a championship. Name, number and rule set are all it needs; the
// players and the publishing state are set up on its championship page.

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

type ChampionshipDialogProps = {
  onOpenChange: (open: boolean) => void;
  onSaved?: (championship: Championship) => void;
  open: boolean;
};

export default function ChampionshipDialog({
  onOpenChange,
  onSaved,
  open,
}: ChampionshipDialogProps) {
  const { championships, createChampionship } = useChampionships();
  const { rules } = useRules();

  const lastNr = championships.reduce((max, c) => (c.nr > max ? c.nr : max), 0);
  const emptyChampionship: Championship = {
    id: '',
    name: '',
    nr: lastNr + 1,
    rulesId: rules[0]?.id ?? '',
    published: false,
    extraPointsPublished: false,
    completed: false,
  };

  const championshipForm = useForm({
    schema: ChampionshipFormSchema,
    initialInput: emptyChampionship,
  });

  useEffect(() => {
    if (open) reset(championshipForm, { initialInput: emptyChampionship });
  }, [open, championshipForm]);

  function handleNameChange() {
    if (isDirty(championshipForm, { path: ['id'] })) return;
    const id = championshipIdFromName(
      (getInput(championshipForm, { path: ['name'] }) ?? '').trim(),
    );
    if (id) reset(championshipForm, { path: ['id'], initialInput: id });
  }

  async function saveChampionship(data: Championship) {
    if (championships.some((c) => c.id === data.id)) {
      setErrors(championshipForm, {
        path: ['id'],
        errors: ['Turnier mit dieser Kennung existiert schon.'],
      });
      focus(championshipForm, { path: ['id'] });
      return;
    }

    await notify(
      createChampionship(data).then(() =>
        invalidateCache([{ type: 'championships' }]),
      ),
      `${data.name} angelegt.`,
    );
    onOpenChange(false);
    onSaved?.(data);
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      form={championshipForm}
      onSubmit={saveChampionship}
      title="Neues Turnier"
      submitLabel="Anlegen"
    >
      <Field of={championshipForm} path={['name']}>
        {(field) => (
          <TextField
            {...field.props}
            label="Bezeichnung"
            required={true}
            placeholder="Hinrunde 2019/20 oder WM 2014"
            value={field.input ?? ''}
            error={field.errors?.[0]}
            onBlur={() => {
              field.props.onBlur();
              handleNameChange();
            }}
          />
        )}
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field of={championshipForm} path={['id']}>
          {(field) => (
            <TextField
              {...field.props}
              label="Kennung"
              required={true}
              placeholder="z. B. hr1920"
              value={field.input ?? ''}
              error={field.errors?.[0]}
            />
          )}
        </Field>
        <Field of={championshipForm} path={['nr']}>
          {(field) => (
            <TextField
              {...field.props}
              label="Nummer"
              required={true}
              type="number"
              min="1"
              value={
                field.input === undefined || Number.isNaN(field.input)
                  ? ''
                  : field.input
              }
              error={field.errors?.[0]}
              onChange={(event) => field.onChange(event.target.valueAsNumber)}
            />
          )}
        </Field>
      </div>
      <Field of={championshipForm} path={['rulesId']}>
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
      </Field>
    </FormDialog>
  );
}
