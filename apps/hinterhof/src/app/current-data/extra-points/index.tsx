import {
  Field,
  Form,
  isDirty,
  reset,
  useFieldArray,
  useForm,
} from '@formisch/react';
import type { Member } from '@haus23/tipprunde-model';
import { useEffect, useMemo } from 'react';
import * as v from 'valibot';
import Button from '#/components/button';
import ResultField from '#/components/form/result-field';
import DataCard from '#/components/layout/data-card';
import { useChampionshipPlayers } from '#/hooks/current-data/use-championship-players';
import { useCurrentChampionship } from '#/hooks/current-data/use-current-championship';
import { useRanking } from '#/hooks/current-data/use-ranking';
import { usePlayers } from '#/hooks/master-data/use-players';
import { invalidateCache } from '#/utils/invalidate-cache';
import { notify } from '#/utils/notify';

const ExtraPointsFormSchema = v.object({
  extraPoints: v.array(
    v.pipe(
      v.string(),
      v.trim(),
      v.regex(/^\d*$/, 'Nur ganze Zahlen ab 0.'),
      v.transform((points) => (points === '' ? undefined : Number(points))),
    ),
  ),
});

export default function ExtraPointsView() {
  const { players: masterPlayers } = usePlayers();
  const { championshipPlayers, updateChampionshipPlayerExtraPoints } =
    useChampionshipPlayers();
  const { currentChampionship } = useCurrentChampionship();
  const { calculateRanking } = useRanking();

  const players = useMemo(() => {
    const playersHash = Object.fromEntries(
      masterPlayers.map((player) => [player.id, player]),
    ) as Record<string, Member>;
    return championshipPlayers
      .map((cp) => ({
        ...cp,
        name: playersHash[cp.playerId].name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [masterPlayers, championshipPlayers]);

  const extraPointsForm = useForm({
    schema: ExtraPointsFormSchema,
    initialInput: { extraPoints: [] },
  });

  useEffect(() => {
    reset(extraPointsForm, {
      initialInput: {
        extraPoints: players.map((p) => p.extraPoints?.toString() ?? ''),
      },
    });
  }, [players, extraPointsForm]);

  const extraPointsFields = useFieldArray(extraPointsForm, {
    path: ['extraPoints'],
  });

  async function save(data: v.InferOutput<typeof ExtraPointsFormSchema>) {
    if (!currentChampionship) return;

    const changedPlayers = championshipPlayers.flatMap((championshipPlayer) => {
      const index = players.findIndex(({ id }) => id === championshipPlayer.id);
      const extraPoints = data.extraPoints[index];
      return extraPoints === championshipPlayer.extraPoints
        ? []
        : [{ ...championshipPlayer, extraPoints }];
    });
    if (changedPlayers.length === 0) return;

    const saveExtraPoints = async () => {
      await Promise.all(
        changedPlayers.map((player) =>
          updateChampionshipPlayerExtraPoints(player, player.extraPoints),
        ),
      );
      await calculateRanking({ players: changedPlayers });
      await invalidateCache([
        { type: 'championship', id: currentChampionship.id },
      ]);
    };

    await notify(
      saveExtraPoints(),
      'Zusatzpunkte gespeichert und Tabelle neu berechnet',
    );
  }

  return (
    <div className="mt-5 flex flex-col space-y-4">
      <Form of={extraPointsForm} onSubmit={save}>
        <DataCard
          title="Zusatzpunkte"
          description="Punkte aus den Zusatzfragen je Mitspieler erfassen."
          action={
            <Button
              variant="primary"
              type="submit"
              disabled={
                !isDirty(extraPointsForm) || extraPointsForm.isSubmitting
              }
            >
              Speichern
            </Button>
          }
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-surface-subtle">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left font-semibold text-foreground text-sm sm:px-6"
                  >
                    Mitspieler
                  </th>
                  <th
                    scope="col"
                    className="w-28 px-4 py-3 text-right font-semibold text-foreground text-sm sm:px-6"
                  >
                    Punkte
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {extraPointsFields.items.map((fieldId, ix) => (
                  <tr key={fieldId}>
                    <td className="px-4 py-3 font-medium text-sm sm:px-6">
                      {players[ix].name}
                    </td>
                    <td className="px-4 py-2 sm:px-6">
                      <Field of={extraPointsForm} path={['extraPoints', ix]}>
                        {(field) => (
                          <ResultField
                            {...field.props}
                            inputMode="numeric"
                            label={`Zusatzpunkte für ${players[ix].name}`}
                            value={field.input ?? ''}
                            error={field.errors?.[0]}
                            className="justify-end"
                          />
                        )}
                      </Field>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DataCard>
      </Form>
    </div>
  );
}
