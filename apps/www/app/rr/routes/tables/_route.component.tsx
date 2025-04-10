import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { useLoaderData } from 'react-router';
import { Fragment } from 'react/jsx-runtime';
import { Link } from '#/components/(ui)/link/link';
import { EmptyData } from '#/components/(ui)/molecules/empty-data';
import { InfoBox } from '#/components/(ui)/molecules/info-box';
import { useChampionship } from '#/utils/app/championship';
import { usePlayers } from '#/utils/app/players';
import type { tablesLoader } from './_route.data';

export function TablesRoute() {
  const championship = useChampionship();
  const players = usePlayers(championship.id);

  const { currentTips } = useLoaderData<ReturnType<typeof tablesLoader>>();

  if (players.length === 0) {
    return (
      <EmptyData championship={championship}>
        Noch sind keine Spieler gemeldet bzw. eingetragen. Noch etwas Geduld
        bitte.
      </EmptyData>
    );
  }

  return (
    <div>
      <header className="mx-2 flex items-center gap-x-2 pt-2 text-accent-foreground sm:mx-0 sm:gap-x-4">
        <title>{`Tabelle ${championship.name} - runde.tips`}</title>
        <h1 className="flex gap-x-2 font-semibold text-xl tracking-tight">
          <span className="hidden sm:block">{championship.name} -</span>
          <span>
            {championship.completed ? 'Abschlusstabelle' : 'Aktuelle Tabelle'}
          </span>
        </h1>
      </header>
      <table className="text-sm">
       
        <tbody className="divide-y divide-neutral-hover font-semibold text-subtle-foreground">
          {players.map((p, ix) => {
            const currentRank =
              ix === 0
                ? '1.'
                : p.rank !== players[ix - 1].rank
                  ? `${p.rank}.`
                  : '';
            return (
              <tr key={p.id}>
                {!championship.completed && currentTips.length > 0 && (
                  <td>
                    <div className="flex items-center pr-2">
                      <InfoBox
                        side="top"
                        collisionPadding={8}
                        icon={CalendarDaysIcon}
                        ariaTriggerLabel={`Aktuelle Tips von ${p.account.name}`}
                      >
                        <div className="grid w-[240px] grid-cols-[1fr_repeat(2,auto)] pb-2 font-normal text-sm">
                          <div className="border-line border-b py-2 pl-2">
                            Spiel
                          </div>
                          <div className="border-line border-b p-2 text-center">
                            Tipp
                          </div>
                          <div className="border-line border-b p-2 text-center">
                            Pkt
                          </div>
                          {currentTips.map((m) => {
                            const tip = m.tips[p.id];
                            return (
                              <Fragment key={m.matchId}>
                                <div
                                  className={[
                                    'py-1 pl-2',
                                    (tip?.joker || tip?.lonelyHit) &&
                                      'bg-primary',
                                  ]
                                    .filter(Boolean)
                                    .join(' ')}
                                >
                                  {!m.hometeam && !m.awayteam
                                    ? '(noch offen)'
                                    : `${m.hometeam || '(noch offen)'} - ${m.awayteam || '(noch offen)'}`}
                                </div>
                                <div
                                  className={[
                                    'py-1 text-center',
                                    (tip?.joker || tip?.lonelyHit) &&
                                      'bg-primary',
                                  ]
                                    .filter(Boolean)
                                    .join(' ')}
                                >
                                  {tip?.tip}
                                </div>
                                <div
                                  className={[
                                    'py-1 text-center',
                                    (tip?.joker || tip?.lonelyHit) &&
                                      'bg-primary',
                                  ]
                                    .filter(Boolean)
                                    .join(' ')}
                                >
                                  {m.result && tip?.points}
                                </div>
                              </Fragment>
                            );
                          })}
                        </div>
                      </InfoBox>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
