import { useChampionshipPlayers } from '@/hooks/current-data/use-championship-players';
import { useRanking } from '@/hooks/current-data/use-ranking';
import { usePlayers } from '@/hooks/master-data/use-players';
import { notify } from '@/utils/notify';
import { Player } from 'lib';
import { useEffect, useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Button, Card, TextField } from 'ui';

type ExtraPointsFormType = {
  extraPoints: { playerId: string; points: number }[];
};

export default function ExtraPointsView() {
  const { players: masterPlayers } = usePlayers();
  const { championshipPlayers, updateChampionshipPlayer } =
    useChampionshipPlayers();
  const { calculateRanking } = useRanking();

  const players = useMemo(() => {
    const playersHash = masterPlayers.reduce(
      (hash, player) => ({ ...hash, [player.id]: player }),
      {} as Record<string, Player>
    );
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
          })
        )
      ),
      'Zusatzpunkte gespeichert'
    );
  }

  async function calculate() {
    await notify(calculateRanking(), 'Tabelle neu berechnet');
  }

  return (
    <div className="mt-5 flex flex-col space-y-4">
      <Card>
        <Card.Header>Zusatzpunkte</Card.Header>
        <div className="py-4 px-4 flex items-center justify-end gap-x-8">
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
                      className="pl-4 pr-2 py-3.5 w-12 text-right text-sm font-semibold text-gray-900"
                    >
                      Spieler
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-2 pr-4 text-sm font-semibold text-gray-900 sm:pr-6 lg:pr-8"
                    >
                      Punkte
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white pr-1">
                  {fields.map((field, ix) => (
                    <tr key={field.id}>
                      <td className="whitespace-nowrap text-right pl-4 pr-2 py-4 text-sm text-gray-500">
                        {players[ix].name}
                      </td>
                      <td className="w-20 pl-2 pr-4 sm:pr-6 lg:pr-8">
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
