import InfoPopover from "@/components/elements/info-popover";
import Select from "@/components/elements/select";
import { useRanking } from "@/hooks/use-ranking";
import { classNames } from "@/utils/class-names";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function MatchesPage() {
  const navigate = useNavigate();
  const { matchId, championshipId } = useParams();
  const { players, /* rounds, */ matches, tips } = useRanking();

  const lastMatch = [...matches].reverse().find(m => m.result !== '') || matches[0];
  const match = matchId ? matches.find(m => m.id === matchId) || lastMatch : lastMatch;

  const matchesForSelect = matches.map(m => ({ id: m.id, match: `${m.hometeam.shortname} - ${m.awayteam.shortname}`}));
  const selectedMatch = matchesForSelect.find(m => m.id === match.id) as { id: string, match: string };

  const championshipRouteSegment = championshipId ? `/${championshipId}` : '';
  function navigateTo(matchId: string) {
    navigate(`${championshipRouteSegment}/spiele/${matchId}`);
  }

  return (
    <div className="mx-auto max-w-5xl mt-6 sm:px-6 lg:px-8">
    <header className="flex text-left justify-start pl-4 sm:pl-0">
      <h1 className="text-xl font-semibold leading-tight tracking-tight flex items-center gap-x-4">
        <span>Tipps für</span>
        <div>
        <Select
              options={matchesForSelect}
              value={selectedMatch}
              onChange={(p) => navigateTo(p.id)}
              displayField="match"
            />
        </div>
      </h1>
    </header>
    <div className="mt-6">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="py-3 pl-2 pr-1 sm:px-4 md:px-6">
                      Spieler
                    </th>
                    <th scope="col" className="sr-only">
                      Info
                    </th>
                    <th scope="col" className="py-3 px-1 sm:px-4 md:px-6 text-center">
                      Tipp
                    </th>
                    <th scope="col" className="py-3 pl-1 pr-2 sm:px-4 md:px-6 text-center">
                      Punkte
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {players
                    .map((p) => {
                      const tip = tips.find(
                        (t) => t.matchId === match.id && t.playerId === p.id
                      );
                      const infoText = [
                        tip?.joker && 'Joker',
                        tip?.lonelyHit && 'Einzeltreffer',
                      ]
                        .filter(Boolean)
                        .join(', ');

                      return (
                        <tr
                          key={p.id}
                          className={classNames(
                            'relative border-b dark:border-gray-700',
                            infoText
                              ? 'bg-blue-100 dark:bg-gray-800'
                              : 'dark:bg-gray-900'
                          )}
                        >
                          <td className="py-4 pl-2 pr-1 sm:px-4 md:px-6">
                            <Link
                              to={`../spieler/${p.playerId}`}
                              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            >
                              {p.name}
                            </Link>
                          </td>
                          <td className="absolute w-5 top-4">
                            {infoText && <InfoPopover text={infoText} />}
                          </td>
                          <td className="text-center py-4 px-1 sm:px-4 md:px-6">
                            {tip?.tip}
                          </td>
                          <td className="text-center py-4 px-1 sm:px-4 md:px-6">
                            {tip?.points}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
    </div>
  </div>
  );
}
