import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as v from 'valibot';
import { EmptyView } from '#/components/app/empty-view';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '#/components/ui/accordion';
import { Select } from '#/components/ui/select';
import { Stats } from '#/components/ui/stats';
import { useChampionship } from '#/utils/app/championship';
import { matchesQuery, playersQuery, playerTipsQuery } from '#/utils/queries';
import { RoundMatchesTable } from './-round-matches-table';

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
        <h1 className="shrink-0 font-medium text-xl">Tipps von</h1>
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
          <div className="mt-6 flex flex-col gap-y-1">
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
                <Accordion key={r.id} defaultOpen={r.id === currentRoundId}>
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
                    <RoundMatchesTable
                      championshipId={championship.id}
                      matches={matchesInRound}
                      teams={teams}
                      tips={tips.tips}
                    />
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
