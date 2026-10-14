import { Field, focus, reset, useForm } from '@formisch/react';
import type { Member } from '@haus23/tipprunde-model';
import { useEffect } from 'react';
import * as v from 'valibot';
import ComboboxField from '#/components/form/combobox-field';
import { FieldError } from '#/components/form/field';
import FormDialog from '#/components/form-dialog';
import { useChampionshipPlayers } from '#/hooks/current-data/use-championship-players';
import { useCurrentChampionship } from '#/hooks/current-data/use-current-championship';
import { usePlayers } from '#/hooks/master-data/use-players';
import { invalidateCache } from '#/utils/invalidate-cache';
import { notify } from '#/utils/notify';

// Adds players to the current championship. Players usually join several at
// a time, so the dialog stays open for the next one.

const PlayerFormSchema = v.object({
  playerId: v.pipe(v.string(), v.nonEmpty('Bitte einen Spieler wählen.')),
});

type ChampionshipPlayerDialogProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export default function ChampionshipPlayerDialog({
  onOpenChange,
  open,
}: ChampionshipPlayerDialogProps) {
  const { currentChampionship } = useCurrentChampionship();
  const { players } = usePlayers();
  const { championshipPlayers, addChampionshipPlayer } =
    useChampionshipPlayers();

  const remainingPlayers = players.filter(
    (player) => !championshipPlayers.some((cp) => cp.playerId === player.id),
  );

  const playerForm = useForm({
    schema: PlayerFormSchema,
    initialInput: { playerId: '' },
  });

  useEffect(() => {
    if (open) reset(playerForm, { initialInput: { playerId: '' } });
  }, [open, playerForm]);

  async function addPlayer({
    playerId,
  }: v.InferOutput<typeof PlayerFormSchema>) {
    if (!currentChampionship) return;
    const player = players.find(({ id }) => id === playerId) as Member;
    await notify(
      addChampionshipPlayer(playerId).then(() =>
        invalidateCache([{ type: 'championship', id: currentChampionship.id }]),
      ),
      `${player.name} hinzugefügt.`,
    );
    reset(playerForm, { initialInput: { playerId: '' } });
    focus(playerForm, { path: ['playerId'] });
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      form={playerForm}
      onSubmit={addPlayer}
      title="Mitspieler hinzufügen"
      cancelLabel="Schließen"
      submitLabel="Hinzufügen"
    >
      <Field of={playerForm} path={['playerId']}>
        {(field) => (
          <div className="space-y-1.5">
            <ComboboxField
              label="Spieler"
              name={field.props.name}
              value={field.input ?? ''}
              onValueChange={field.onChange}
              onBlur={field.props.onBlur}
              ref={field.props.ref}
              options={remainingPlayers}
              filter={(query, player) =>
                player.name.toLowerCase().includes(query.toLowerCase())
              }
            />
            {field.errors?.[0] && <FieldError>{field.errors[0]}</FieldError>}
          </div>
        )}
      </Field>
    </FormDialog>
  );
}
