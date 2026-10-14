import { Field, reset, useForm } from '@formisch/react';
import type { Round } from '@haus23/tipprunde-model';
import { useEffect } from 'react';
import * as v from 'valibot';
import ToggleField from '#/components/form/toggle-field';
import FormDialog from '#/components/form-dialog';
import { useCurrentChampionship } from '#/hooks/current-data/use-current-championship';
import { useRounds } from '#/hooks/current-data/use-rounds';
import { invalidateCache } from '#/utils/invalidate-cache';
import { notify } from '#/utils/notify';

// Creates the next round of the current championship.

const RoundFormSchema = v.object({ isDoubleRound: v.boolean() });

type RoundDialogProps = {
  onOpenChange: (open: boolean) => void;
  onSaved?: (round: Pick<Round, 'nr' | 'isDoubleRound'>) => void;
  open: boolean;
};

export default function RoundDialog({
  onOpenChange,
  onSaved,
  open,
}: RoundDialogProps) {
  const { currentChampionship } = useCurrentChampionship();
  const { rounds, createRound } = useRounds();
  const nr = (rounds.at(-1)?.nr ?? 0) + 1;

  const roundForm = useForm({
    schema: RoundFormSchema,
    initialInput: { isDoubleRound: false },
  });

  useEffect(() => {
    if (open) reset(roundForm, { initialInput: { isDoubleRound: false } });
  }, [open, roundForm]);

  async function saveRound({
    isDoubleRound,
  }: v.InferOutput<typeof RoundFormSchema>) {
    if (!currentChampionship) return;
    await notify(
      createRound(nr, isDoubleRound).then(() =>
        invalidateCache([{ type: 'championship', id: currentChampionship.id }]),
      ),
      `Runde ${nr} angelegt.`,
    );
    onOpenChange(false);
    onSaved?.({ nr, isDoubleRound });
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      form={roundForm}
      onSubmit={saveRound}
      title={`Runde ${nr} anlegen`}
      submitLabel="Anlegen"
    >
      <Field of={roundForm} path={['isDoubleRound']}>
        {(field) => (
          <ToggleField
            name={field.props.name}
            ref={field.props.ref}
            onBlur={field.props.onBlur}
            checked={field.input ?? false}
            onChange={(event) => field.onChange(event.currentTarget.checked)}
            label="Doppelte Punkte in dieser Runde"
          />
        )}
      </Field>
    </FormDialog>
  );
}
