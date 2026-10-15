import type { Tip } from '@haus23/tipprunde-model';
import { noop, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo } from 'react';
import * as v from 'valibot';
import { EmptyView } from '#/components/app/empty-view';
import { Infotip } from '#/components/ui/infotip';
import { Select } from '#/components/ui/select';
import { Stats } from '#/components/ui/stats';
import { useChampionship } from '#/utils/app/championship';
import { formatDate } from '#/utils/misc';
import { matchesQuery, matchTipsQuery, playersQuery } from '#/utils/queries';
import { MatchTipsTable } from './-match-tips-table';

export const Route = createFileRoute('/$turnier/spiel')({
  validateSearch: v.object({
    nr: v.optional(v.number()),
  }),
  loaderDeps: ({ search: { nr } }) => ({ nr }),
  loader: async ({ deps: { nr }, context: { queryClient, championship } }) => {
    const matches = await queryClient.query(matchesQuery(championship.id));

    const match =
      matches.matches.find((m) => m.nr === nr) ||
      matches.matches
        .toSorted((a, b) => (a.date ?? '').localeCompare(b.date ?? ''))
        .findLast((m) => m.result) ||
      matches.matches[0];

    if (match) {
      queryClient.query(matchTipsQuery(championship.id, match.nr)).catch(noop);
    }
    return { match };
  },
  component: MatchesRoute,
});

function MatchesRoute() {
  const { match } = Route.useLoaderData();

  if (!match) {
    return (
      <div>
        <h1 className="mx-4 font-medium text-xl sm:mx-0">Spiele</h1>
        <EmptyView>Noch keine Spiele.</EmptyView>
      </div>
    );
  }

  return <MatchesComponent match={match} />;
}

function MatchesComponent({
  match,
}: {
  match: NonNullable<ReturnType<typeof Route.useLoaderData>['match']>;
}) {
  const championship = useChampionship();
  const navigate = useNavigate({ from: Route.fullPath });

  function selectMatch(nr: string) {
    navigate({ search: (prev) => ({ ...prev, nr: Number(nr) }) });
  }

  const { data: players } = useSuspenseQuery(playersQuery(championship.id));
  const {
    data: { tips },
  } = useSuspenseQuery(matchTipsQuery(championship.id, match.nr));

  const {
    data: { matches, rounds, teams, leagues },
  } = useSuspenseQuery(matchesQuery(championship.id));

  const matchTips = useMemo(
    () => players.map((p): Partial<Tip> => tips[p.id] || { playerId: p.id }),
    [players, tips],
  );

  const matchResult = matches.find((m) => m.id === match.id)?.result;

  return (
    <div>
      <div className="mx-4 flex items-center gap-x-2 sm:mx-0 sm:gap-x-4">
        <h1 className="shrink-0 font-medium text-xl">Tipps für</h1>
        <Select
          aria-label="Spielauswahl"
          name="match"
          value={String(match.nr)}
          onValueChange={selectMatch}
          groups={rounds.map((r) => ({
            value: r.id,
            label: `Runde ${r.nr}`,
            options: matches
              .filter((m) => m.roundId === r.id)
              .map((m) => ({
                value: String(m.nr),
                label: `${teams[m.hometeamId]?.shortname || '(noch offen)'} – ${teams[m.awayteamId]?.shortname || '(noch offen)'}`,
                detail:
                  m.result !== '' ? (
                    <span className="font-semibold text-muted-foreground/80 text-sm">{`(${m.points ?? 0} Pkt)`}</span>
                  ) : undefined,
              })),
          }))}
        />
      </div>
      <div className="mx-4 mt-6 text-sm sm:mx-0">
        <Stats
          stats={[
            { label: 'Wann', value: formatDate(match.date) || '–' },
            {
              label: 'Wo',
              value: leagues[match.leagueId]?.name || '–',
            },
            { label: 'Ergebnis', value: match.result || '–' },
            {
              label: 'Punkte',
              value: match.result ? (match.points ?? 0) : '–',
            },
          ]}
        />
        {rounds.find((r) => r.id === match.roundId)?.isDoubleRound ? (
          <div className="mt-4 flex items-center justify-center gap-x-2 text-muted-foreground">
            <span>Das Spiel läuft in einer Doppelrunde.</span>
            <span className="hidden sm:block">
              Alle erzielten Punkte werden verdoppelt.
            </span>
            <Infotip label="Doppel-Punkte Rundeninfo" className="sm:hidden">
              Alle erzielten Punkte werden verdoppelt.
            </Infotip>
          </div>
        ) : null}
      </div>
      <MatchTipsTable
        className="mt-6 text-sm"
        championshipId={championship.id}
        players={players}
        showPoints={Boolean(matchResult)}
        tips={matchTips}
      />
    </div>
  );
}
