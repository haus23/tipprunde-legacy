import { Field, Form, reset, useFieldArray, useForm } from '@formisch/react';
import type { Member } from '@haus23/tipprunde-model';
import { useEffect, useMemo } from 'react';
import * as v from 'valibot';
import Button from '#/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '#/components/card';
import { fieldControlStyles } from '#/components/form/field';
import { useChampionshipPlayers } from '#/hooks/current-data/use-championship-players';
import { useCurrentChampionship } from '#/hooks/current-data/use-current-championship';
import { useRanking } from '#/hooks/current-data/use-ranking';
import { usePlayers } from '#/hooks/master-data/use-players';
import { invalidateCache } from '#/utils/invalidate-cache';
import { notify } from '#/utils/notify';

const ExtraPointsFormSchema = v.object({
  extraPoints: v.array(v.string()),
});

export default function ExtraPointsView() {
  const { players: masterPlayers } = usePlayers();
  const { championshipPlayers } = useChampionshipPlayers();
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
        extraPoints: players.map((p) => String(p.extraPoints ?? 0)),
      },
    });
  }, [players, extraPointsForm]);

  const extraPointsFields = useFieldArray(extraPointsForm, {
    path: ['extraPoints'],
  });

  async function save(data: v.InferOutput<typeof ExtraPointsFormSchema>) {
    if (!currentChampionship) return;

    const updatedPlayers = players.map((player, index) => ({
      ...player,
      extraPoints: Number(data.extraPoints[index]),
    }));
    const saveExtraPoints = async () => {
      await calculateRanking({ players: updatedPlayers });
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>Zusatzpunkte</CardTitle>
              <p className="mt-1 text-muted-foreground text-sm">
                Punkte aus den Zusatzfragen je Mitspieler erfassen.
              </p>
            </div>
            <Button variant="primary" type="submit">
              Speichern
            </Button>
          </CardHeader>
          <CardContent className="p-0 sm:p-0">
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
                            <input
                              {...field.props}
                              type="text"
                              inputMode="numeric"
                              value={field.input ?? ''}
                              aria-label={`Zusatzpunkte für ${players[ix].name}`}
                              className={fieldControlStyles({
                                className:
                                  'ml-auto w-20 text-right font-medium tabular-nums',
                              })}
                            />
                          )}
                        </Field>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </Form>
    </div>
  );
}
