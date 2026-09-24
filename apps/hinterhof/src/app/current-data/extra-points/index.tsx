import type { Member } from 'lib';
import { useEffect, useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Button, Card, TextField } from 'ui-legacy';
import { useChampionshipPlayers } from '#/hooks/current-data/use-championship-players';
import { useRanking } from '#/hooks/current-data/use-ranking';
import { usePlayers } from '#/hooks/master-data/use-players';
import { notify } from '#/utils/notify';

type ExtraPointsFormType = {
  extraPoints: { playerId: string; points: number }[];
};

export default function ExtraPointsView() {
  const { players: masterPlayers } = usePlayers();
  const { championshipPlayers, updateChampionshipPlayer } =
    useChampionshipPlayers();
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

  const { control, handleSubmit, reset } = useForm<ExtraPointsFormType>({
    defaultValues: {
      extraPoints: new Array(players.length).fill({ matchId: '', result: '' }),
    },
  });

  useEffect(() => {
    reset({
      extraPoints: players.map((p) => ({
        playerId: p.id,
        points: p.extraPoints,
      })),
    });
  }, [players, reset]);

  const { fields } = useFieldArray({ control, name: 'extraPoints' });

  async function save(data: ExtraPointsFormType) {
    console.log(data.extraPoints);
    await notify(
      Promise.all(
        players.map((p, ix) =>
          updateChampionshipPlayer(p.id, {
            extraPoints: Number(data.extraPoints[ix].points),
          }),
        ),
      ),
      'Zusatzpunkte gespeichert',
    );
  }

  async function calculate() {
    await notify(calculateRanking(), 'Tabelle neu berechnet');
  }

  return (
    <div className="mt-5 flex flex-col space-y-4">
      <Card>
        <Card.Header>Zusatzpunkte</Card.Header>
        <div className="flex items-center justify-end gap-x-8 px-4 py-4">
          <Button
            type="button"
            primary={true}
            onClick={handleSubmit(calculate)}
          >
            Tabelle berechnen
          </Button>
          <Button type="button" primary={true} onClick={handleSubmit(save)}>
            Speichern
          </Button>
        </div>
        <div className="p-4">
          <form>
            <div className="overflow-x-auto overflow-y-hidden">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="w-12 py-3.5 pr-2 pl-4 text-right font-semibold text-gray-900 text-sm"
                    >
                      Spieler
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pr-4 pl-2 font-semibold text-gray-900 text-sm sm:pr-6 lg:pr-8"
                    >
                      Punkte
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white pr-1">
                  {fields.map((field, ix) => (
                    <tr key={field.id}>
                      <td className="whitespace-nowrap py-4 pr-2 pl-4 text-right text-gray-500 text-sm">
                        {players[ix].name}
                      </td>
                      <td className="w-20 pr-4 pl-2 sm:pr-6 lg:pr-8">
                        <TextField
                          control={control}
                          name={`extraPoints.${ix}.points`}
                          label=""
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
