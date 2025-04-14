import { useLoaderData, useSearchParams } from 'react-router';
import { Link } from '#/components/(ui)/link/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#/components/(ui)/molecules/accordion';
import { EmptyData } from '#/components/(ui)/molecules/empty-data';
import { InfoBox } from '#/components/(ui)/molecules/info-box';
import { formatDate } from '#/utils/misc';
import type { playersLoader } from './_route.data';

export function PlayersRoute() {
  const loaderData = useLoaderData<ReturnType<typeof playersLoader>>();
  if (loaderData.state === 'error') {
    return (
      <EmptyData championship={championship}>
        Noch sind keine Spieler gemeldet bzw. eingetragen. Noch etwas Geduld
        bitte.
      </EmptyData>
    );
  }

  function scrollToRound(roundId: string) {
    setTimeout(() => {
      const elem = document.getElementById(roundId);
      elem &&
        window.scrollTo({
          behavior: 'smooth',
          top:
            elem.getBoundingClientRect().top -
            document.body.getBoundingClientRect().top -
            48,
        });
    }, 250);
  }

  return (
    <div>
      <title>{`Tipps ${player.account.name} - ${championship.name} - runde.tips`}</title>

      <div className="mx-2 mt-6 max-w-3xl text-sm md:mx-auto">
        <div className="flex w-full justify-between">
          <div className="space-y-1">
            <p className="font-medium text-xs uppercase">Platz</p>
            <p className="brand-app-text-contrast text-center font-semibold">{`${player.rank}.`}</p>
          </div>
          <div className="space-y-1">
            <p className="px-4 font-medium text-xs uppercase">Spiele</p>
            <p className="brand-app-text-contrast text-center font-semibold">{`${playedMatches} (${matches.length})`}</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-xs uppercase">Punkte</p>
            <p className="brand-app-text-contrast text-center font-semibold">
              {player.points}
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-xs uppercase">Schnitt</p>
            <p className="brand-app-text-contrast text-center font-semibold">{`${
              playedMatches ? (player.points / playedMatches).toFixed(2) : ''
            }`}</p>
          </div>
        </div>
      </div>
      <Accordion
        type="single"
        defaultValue={currentRoundId}
        onValueChange={scrollToRound}
        className="mt-6"
      >
        {rounds.map((r) => {
          const matchesInRound = matches.filter((m) => m.roundId === r.id);

          // Calculate round stats
          const matchIds = matchesInRound.map((m) => m.id);
          const playedMatchesInRoundCount = matchesInRound.filter(
            (m) => m.result,
          ).length;
          const pointsPerRound = Object.values(tips).reduce(
            (sum, t) => (matchIds.includes(t.matchId) ? sum + t.points : sum),
            0,
          );

          return (
            <AccordionItem id={r.id} key={r.id} value={r.id}>
              <AccordionTrigger>
                <div className="flex grow items-center justify-between font-semibold">
                  <span className="block">{`Runde ${r.nr}`}</span>
                  <div className="mr-4 flex items-center gap-x-4">
                    {playedMatchesInRoundCount > 0 && (
                      <div className="flex gap-x-4 text-sm">
                        <div className="flex gap-x-2">
                          <span className="hidden sm:block">Spiele:</span>
                          <span className="sm:hidden">Sp:</span>
                          {playedMatchesInRoundCount}
                        </div>
                        <div className="flex gap-x-2">
                          <span className="hidden sm:block">Punkte:</span>
                          <span className="sm:hidden">Pkt:</span>
                          {pointsPerRound}
                        </div>
                        <div className="flex gap-x-2">
                          <span>&#x2300;</span>
                          {(pointsPerRound / playedMatchesInRoundCount).toFixed(
                            2,
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <table className="my-1 w-full text-sm">
                  <thead className="bg-accent-subtle text-accent-foreground text-xs">
                    <tr>
                      <th
                        scope="col"
                        className="hidden px-2 text-center sm:table-cell sm:px-4 md:px-6 "
                      >
                        <span className="font-medium uppercase">Nr</span>
                      </th>
                      <th
                        scope="col"
                        className="hidden px-2 text-center sm:table-cell sm:px-4 md:px-6 "
                      >
                        <span className="font-medium uppercase">Datum</span>
                      </th>
                      <th
                        scope="col"
                        className="w-full px-2 py-3 text-left sm:px-4 md:px-6"
                      >
                        <span className="font-medium uppercase">Spiel</span>
                      </th>
                      <th
                        scope="col"
                        className="px-2 text-center sm:px-4 md:px-6"
                      >
                        <span className="font-medium uppercase">Ergebnis</span>
                      </th>
                      <th
                        scope="col"
                        className="pr-6 pl-2 text-center sm:pl-4 md:pl-6"
                      >
                        <span className="font-medium uppercase">Tipp</span>
                      </th>
                      <th
                        scope="col"
                        className="px-2 text-center sm:px-4 md:px-6"
                      >
                        <span className="font-medium uppercase">Punkte</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-hover font-semibold text-subtle-foreground">
                    {matchesInRound.map((m) => {
                      const tip = tips[m.id];
                      const info = tip?.joker || tip?.lonelyHit || false;
                      return (
                        <tr
                          className={info ? 'bg-primary-active' : ''}
                          key={m.id}
                        >
                          <td className="hidden px-2 text-center sm:table-cell sm:px-4 md:px-6">
                            {m.nr}
                          </td>
                          <td className="hidden px-2 text-center sm:table-cell sm:px-4 md:px-6">
                            {formatDate(m.date, { shortIfCurrent: true })}
                          </td>
                          <td className="w-full px-2 sm:px-4 md:px-6">
                            <div className="py-1.5">
                              <Link
                                prefetch="viewport"
                                to={`../spiel?nr=${m.nr}`}
                                className={`inline-block w-full rounded-xs p-1 data-hovered:text-accent-foreground data-hovered:underline ${info ? 'data-focus-visible:ring-offset-primary-active' : ''}`}
                              >
                                <span className="hidden md:inline">
                                  {teams[m.hometeamId]?.name || 'TBA'} -
                                  {teams[m.awayteamId]?.name || 'TBA'}
                                </span>
                                <span className="md:hidden">
                                  {teams[m.hometeamId]?.shortname || 'TBA'} -
                                  {teams[m.awayteamId]?.shortname || 'TBA'}
                                </span>
                              </Link>
                            </div>
                          </td>
                          <td className="px-2 text-center sm:px-4 md:px-6">
                            {m.result}
                          </td>
                          <td className="relative pr-6 pl-2 text-center sm:pl-4 md:pl-6">
                            <span>{tip?.tip}</span>
                            {info && (
                              <span className="absolute right-0">
                                <InfoBox
                                  align="end"
                                  side="top"
                                  ariaTriggerLabel="Zusatzinfos zum Tipp"
                                >
                                  <div className="px-4 py-2">
                                    {tip?.joker === true && <p>Joker</p>}
                                    {tip?.lonelyHit === true && (
                                      <p>Einziger richtiger Tipp</p>
                                    )}
                                  </div>
                                </InfoBox>
                              </span>
                            )}
                          </td>
                          <td className="px-2 text-center sm:px-4 md:px-6">
                            {m.result && tip?.points}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
