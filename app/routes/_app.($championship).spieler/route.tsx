import { type V2_MetaFunction } from '@remix-run/node';
import { Await, Link, useSearchParams } from '@remix-run/react';

import { Select } from '~/components/elements/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/molecules/accordion';
import { cn, formatDate } from '~/utils';
import { getChampionship, getChampionshipPlayers } from '~/utils/route-match-helper';
import { useChampionship } from '~/utils/use-championship';
import { useChampionshipMatches } from '~/utils/use-championship-matches';
import { useChampionshipPlayers } from '~/utils/use-championship-players';

export const meta: V2_MetaFunction = ({ matches, params, location }) => {
  const championship = getChampionship(params.championship, matches);
  const players = getChampionshipPlayers(matches);
  const playerQuery = new URLSearchParams(location.search).get('name');
  const player = players.find((p) => p.account.id === playerQuery) || players[0];
  return [{ title: `Tipps ${player.account.name} ${championship.name} - runde.tips` }];
};

export default function Spieler() {
  const championship = useChampionship();
  const players = useChampionshipPlayers();
  const matchesPromise = useChampionshipMatches();

  const [searchParams, setSearchParams] = useSearchParams();

  const accId = searchParams.get('name');
  const player = players.find((p) => p.account.id === accId) || players[0];

  function handleSelect(value: string) {
    const accId = players.find((p) => p.id === value)?.account.id;
    setSearchParams({ ...searchParams, name: accId });
  }

  return (
    <>
      <header className="mx-2 flex items-center gap-x-4 text-accent-foreground sm:mx-0 sm:gap-x-4">
        <h2 className="flex gap-x-2 text-xl font-semibold tracking-tight">
          <span className="hidden py-1 sm:block">{championship.name} -</span>
          <span className="py-1">Tipps von </span>
        </h2>
        <Select
          value={player.id}
          onValueChanged={handleSelect}
          options={players}
          display={(p) => p.account.name}
        />
      </header>
      <Await resolve={matchesPromise}>
        {({ matches, rounds, teams }) => {
          // find current round
          let currentRoundId: string | undefined = undefined;
          if (!championship.completed) {
            // Find last played match
            const match = [...matches].reverse().find((m) => m.result);
            if (!match) {
              // No match played, but is there a first round?
              if (rounds.length > 0) {
                currentRoundId = rounds[0].id;
              }
            } else {
              // Test if there is already a next round match
              const matchIx = matches.indexOf(match);
              currentRoundId = matches.at(matchIx + 1)?.roundId || match.roundId;
            }
          }

          const playedMatches = matches.filter((m) => m.result).length;

          return (
            <>
              <div className="mx-2 mt-6 max-w-3xl text-sm md:mx-auto">
                <div className="flex w-full justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase">Platz</p>
                    <p className="brand-app-text-contrast text-center font-semibold">{`${player.rank}.`}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="px-4 text-xs font-medium uppercase">Spiele</p>
                    <p className="brand-app-text-contrast text-center font-semibold">{`${playedMatches} (${matches.length})`}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase">Punkte</p>
                    <p className="brand-app-text-contrast text-center font-semibold">
                      {player.points}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase">Schnitt</p>
                    <p className="brand-app-text-contrast text-center font-semibold">{`${
                      playedMatches ? (player.points / playedMatches).toFixed(2) : ''
                    }`}</p>
                  </div>
                </div>
              </div>
              <Accordion
                type="single"
                collapsible
                className="mt-6 space-y-1"
                defaultValue={currentRoundId}
              >
                {rounds.map((r) => {
                  const matchesInRound = matches.filter((m) => m.roundId === r.id);
                  return (
                    <AccordionItem key={r.id} value={r.id}>
                      <AccordionTrigger className="bg-primary px-4 py-2 hover:bg-primary-hover">
                        Runde {r.nr}
                      </AccordionTrigger>
                      <AccordionContent>
                        <table className="w-full text-sm">
                          <thead className="bg-accent-subtle  text-xs text-accent-foreground">
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
                              <th scope="col" className="px-2 text-center sm:px-4 md:px-6 ">
                                <span className="font-medium uppercase">Ergebnis</span>
                              </th>
                              <th scope="col" className="px-2 text-center sm:px-4 md:px-6 ">
                                <span className="font-medium uppercase">Tipp</span>
                              </th>
                              <th scope="col" className="px-2 text-center sm:px-4 md:px-6">
                                <span className="font-medium uppercase">Punkte</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-line font-semibold text-subtle-foreground">
                            {matchesInRound.map((m) => {
                              // const tip = tips.find((t) => t.matchId === m.id && t.playerId === player?.id);
                              // const info = tip?.joker || tip?.lonelyHit || false;
                              const tip = { tip: '', points: undefined };
                              const info = false;
                              return (
                                <tr className={cn(info && 'brand-bg')} key={m.id}>
                                  <td className="hidden px-2 text-center sm:table-cell sm:px-4 md:px-6">
                                    {m.nr}
                                  </td>
                                  <td className="hidden px-2 text-center sm:table-cell sm:px-4 md:px-6">
                                    {formatDate(m.date, { shortIfCurrent: true })}
                                  </td>
                                  <td className="w-full px-2 sm:px-4 md:px-6">
                                    <Link
                                      to={`../spiel/${m.nr}/${m.hometeamId}-${m.awayteamId}`}
                                      className="inline-block w-full py-2.5 hover:text-accent-foreground hover:underline"
                                    >
                                      <span className="hidden md:inline">
                                        {teams[m.hometeamId].name} - {teams[m.awayteamId].name}
                                      </span>
                                      <span className="md:hidden">
                                        {teams[m.hometeamId].shortname} -{' '}
                                        {teams[m.awayteamId].shortname}
                                      </span>
                                    </Link>
                                  </td>
                                  <td className="px-2 text-center sm:px-4 md:px-6">{m.result}</td>
                                  <td className="px-2 text-center sm:px-4 md:px-6">
                                    <div className="relative flex items-center">
                                      <span>{tip?.tip}</span>
                                      {/*info && (
                                <Tooltip className="absolute right-0 translate-x-6">
                                  <div className="px-4 py-2">
                                    {tip?.joker === true && <p>Joker</p>}
                                    {tip?.lonelyHit === true && <p>Einziger richtiger Tipp</p>}
                                  </div>
                                </Tooltip>
                              )*/}
                                    </div>
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
            </>
          );
        }}
      </Await>
    </>
  );
}
