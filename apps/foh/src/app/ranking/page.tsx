import { useCurrentChampionship } from '@/hooks/use-current-championship';
import { useRanking } from '@/hooks/use-ranking';

export default function RankingPage() {
  const championship = useCurrentChampionship();
  const { players } = useRanking();

  return (
    <div>
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-semibold leading-tight tracking-tight text-gray-900">
            {championship?.completed
              ? `Abschlusstabelle ${championship.name}`
              : `Aktuelle Tabelle ${championship?.name}`}
          </h1>
          {players.length === 0 && (
            <p className="mt-2 text-sm text-gray-700">
              Es sind noch keine Mitspieler angemeldet.
            </p>
          )}
        </div>
      </header>
      {players.length > 0 && (
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div className="flex flex-col">
              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 w-12 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            Platz
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Name
                          </th>
                          <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-sm font-semibold text-gray-900"
                          >
                            Punkte
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {players.map((player, playerIdx, players) => {
                          const currentRank =
                            playerIdx === 0
                              ? '1.'
                              : player.rank !== players[playerIdx].rank
                              ? `${player.rank}.`
                              : '';
                          return (
                            <tr
                              key={player.id}
                              className={
                                playerIdx % 2 === 0 ? undefined : 'bg-gray-50'
                              }
                            >
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-right text-sm font-medium text-gray-900 sm:pl-6">
                                {currentRank}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {player.name}
                              </td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                {player.totalPoints}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
