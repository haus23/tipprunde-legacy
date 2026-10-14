import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as v from 'valibot';
import { EmptyView } from '#/components/app/empty-view';
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
} from '#/components/ui/accordion';
import { Link } from '#/components/ui/link';
import { Popover } from '#/components/ui/popover';
import { Select } from '#/components/ui/select';
import { Stats } from '#/components/ui/stats';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table';
import { useChampionship } from '#/utils/app/championship';
import { formatDate } from '#/utils/misc';
import { matchesQuery, playersQuery, playerTipsQuery } from '#/utils/queries';

export const Route = createFileRoute('/$turnier/spieler')({
  validateSearch: v.object({
    name: v.optional(v.string()),
  }),
  loaderDeps: ({ search: { name } }) => ({ accountId: name }),
  loader: async ({
    deps: { accountId },
    context: { queryClient, championship },
  }) => {
    const players = await queryClient.ensureQueryData(
      playersQuery(championship.id),
    );
    const player =
      players.find((p) => p.account.id === accountId) || players[0];

    if (player) {
      queryClient.prefetchQuery(
        playerTipsQuery(championship.id, player.account.id),
      );
    }
    return { player };
  },
  component: PlayersRoute,
});

function PlayersRoute() {
  const { player } = Route.useLoaderData();

  if (!player) {
    return (
      <div>
        <h1 className="mx-4 font-medium text-xl sm:mx-0">Mitspieler</h1>
        <EmptyView>Noch keine Mitspieler.</EmptyView>
      </div>
    );
  }

  return <PlayersComponent player={player} />;
}

function PlayersComponent({
  player,
}: {
  player: NonNullable<ReturnType<typeof Route.useLoaderData>['player']>;
}) {
  const championship = useChampionship();
  const navigate = useNavigate({ from: Route.fullPath });
  const { data: players } = useSuspenseQuery(playersQuery(championship.id));

  function selectAccount(accountId: string) {
    navigate({ search: (prev) => ({ ...prev, name: accountId }) });
  }

  const {
    data: { matches, rounds, teams },
  } = useSuspenseQuery(matchesQuery(championship.id));
  const { data: tips } = useSuspenseQuery(
    playerTipsQuery(championship.id, player.account.id),
  );

  // Calculate page helper data
  const playedMatches = matches.filter((m) => m.result).length;
  const currentRoundId =
    matches.findLast((m) => m.result)?.roundId || matches.at(0)?.roundId || '';

  return (
    <div>
      <div className="mx-4 flex items-center gap-x-4 sm:mx-0">
        <h1 className="font-medium text-xl">
          <span className="hidden sm:inline">{championship.name} - </span>
          <span>Tipps von</span>
        </h1>
        <Select
          aria-label="Spielerauswahl"
          name="player"
          value={player.account.id}
          onValueChange={selectAccount}
          options={players.map((p) => ({
            value: p.account.id,
            label: p.account.name,
          }))}
        />
      </div>
      {matches.length === 0 ? (
        <EmptyView>Noch keine Spiele.</EmptyView>
      ) : (
        <>
          <Stats
            className="mx-4 mt-6 text-sm sm:mx-0"
            stats={[
              {
                label: 'Platz',
                value: player.rank === undefined ? '–' : `${player.rank}.`,
              },
              {
                label: 'Spiele',
                value: `${playedMatches} von ${matches.length}`,
              },
              { label: 'Punkte', value: player.points ?? '–' },
              {
                label: 'Schnitt',
                value:
                  playedMatches && player.points !== undefined
                    ? (player.points / playedMatches).toFixed(2)
                    : '–',
              },
            ]}
          />
          <AccordionGroup
            multiple
            defaultValue={[currentRoundId]}
            className="mt-6 flex flex-col gap-y-1"
          >
            {rounds.map((r) => {
              // Calculate round helpder data
              const matchesInRound = matches.filter((m) => m.roundId === r.id);
              const playedMatchesInRoundCount = matchesInRound.filter(
                (m) => m.result,
              ).length;
              const pointsInRound = matchesInRound.reduce(
                (sum, cur) => sum + (tips.tips[cur.id]?.points ?? 0),
                0,
              );

              return (
                <Accordion value={r.id} key={r.id}>
                  <AccordionSummary className="flex grow items-center justify-between tabular-nums">
                    <div className="justify-self-start">
                      Runde <span>{r.nr}</span>
                    </div>
                    {playedMatchesInRoundCount > 0 && (
                      <div className="flex gap-x-3 text-sm sm:gap-x-4">
                        <div className="flex justify-end gap-x-1.5 sm:gap-x-2">
                          <span className="hidden sm:block">Spiele:</span>
                          <span className="sm:hidden">Sp:</span>
                          {playedMatchesInRoundCount}
                        </div>
                        <div className="flex justify-end gap-x-1.5 sm:gap-x-2">
                          <span className="hidden sm:block">Punkte:</span>
                          <span className="sm:hidden">Pkt:</span>
                          {pointsInRound}
                        </div>
                        <div className="flex justify-end gap-x-1.5 sm:gap-x-2">
                          <span>&#x2300;</span>
                          {(pointsInRound / playedMatchesInRoundCount).toFixed(
                            2,
                          )}
                        </div>
                      </div>
                    )}
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="py-1 text-sm">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="hidden sm:table-cell">
                              Nr
                            </TableHead>
                            <TableHead className="hidden sm:table-cell">
                              Datum
                            </TableHead>
                            <TableHead className="text-left max-sm:pl-4 md:pl-6">
                              Spiel
                            </TableHead>
                            <TableHead>Ergebnis</TableHead>
                            <TableHead className="px-6 md:px-6">Tipp</TableHead>
                            <TableHead>Punkte</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {matchesInRound.map((match) => {
                            const tip = tips.tips[match.id];
                            return (
                              <TableRow
                                key={match.id}
                                className={
                                  tip?.joker || tip?.lonelyHit
                                    ? 'bg-highlight'
                                    : undefined
                                }
                              >
                                <TableCell className="hidden text-center tabular-nums sm:table-cell">
                                  {match.nr}
                                </TableCell>
                                <TableCell className="hidden text-center tabular-nums sm:table-cell">
                                  {formatDate(match.date, {
                                    shortIfCurrent: true,
                                  })}
                                </TableCell>
                                <TableCell className="w-full font-medium max-sm:pl-2">
                                  <Link
                                    to="/$turnier/spiel"
                                    params={{ turnier: championship.id }}
                                    search={(prev) => ({
                                      ...prev,
                                      nr: match.nr,
                                    })}
                                    className="block py-1"
                                  >
                                    <span className="hidden md:inline">
                                      {`${teams[match.hometeamId]?.name || '(noch offen)'} – ${teams[match.awayteamId]?.name || '(noch offen)'}`}
                                    </span>
                                    <span className="md:hidden">
                                      {`${teams[match.hometeamId]?.shortname || '(noch offen)'} – ${teams[match.awayteamId]?.shortname || '(noch offen)'}`}
                                    </span>
                                  </Link>
                                </TableCell>
                                <TableCell className="text-center tabular-nums">
                                  {match.result}
                                </TableCell>
                                <TableCell className="px-6 tabular-nums md:px-6">
                                  {/* Tip centered, the info icon next to it without moving it */}
                                  <div className="grid grid-cols-[1fr_auto_1fr] items-center">
                                    <span />
                                    <span>{tip?.tip}</span>
                                    <span className="justify-self-start">
                                      {(tip?.joker || tip?.lonelyHit) && (
                                        <Popover
                                          offset={4}
                                          triggerLabel="Zusatzinfos zum Tipp"
                                          triggerClassName="-my-1.5"
                                        >
                                          <div className="px-4 py-2">
                                            {tip?.joker === true && (
                                              <p>Joker</p>
                                            )}
                                            {tip?.lonelyHit === true && (
                                              <p>Einziger richtiger Tipp</p>
                                            )}
                                          </div>
                                        </Popover>
                                      )}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-center tabular-nums">
                                  {match.result && (tip?.points ?? 0)}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </AccordionGroup>
        </>
      )}
    </div>
  );
}
