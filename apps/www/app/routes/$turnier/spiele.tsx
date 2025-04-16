import type { Tip } from '@haus23/tipprunde-model';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { CheckIcon } from 'lucide-react';
import { useMemo } from 'react';
import { Collection, type Key } from 'react-aria-components';
import * as v from 'valibot';
import { DataTable } from '#/components/ui/data-table';
import { Header } from '#/components/ui/header';
import { ListBoxItem, ListBoxSection } from '#/components/ui/listbox';
import { Select } from '#/components/ui/select';
import { useChampionship } from '#/utils/app/championship';
import { matchTipsQuery, matchesQuery, playersQuery } from '#/utils/queries';

export const Route = createFileRoute('/$turnier/spiele')({
  validateSearch: v.object({
    nr: v.optional(v.number()),
  }),
  loaderDeps: ({ search: { nr } }) => ({ nr }),
  loader: async ({ deps: { nr }, context: { queryClient, championship } }) => {
    const matches = await queryClient.ensureQueryData(
      matchesQuery(championship.id),
    );
    // TODO: default match is last match in current championship
    const match =
      matches.matches.find((m) => m.nr === nr) || matches.matches[0];

    queryClient.prefetchQuery(matchTipsQuery(championship.id, nr ?? null));
    return { match };
  },
  component: MatchesComponent,
});

const columnHelper = createColumnHelper<Tip>();

function MatchesComponent() {
  const championship = useChampionship();
  const navigate = useNavigate({ from: Route.fullPath });

  const { match } = Route.useLoaderData();
  function selectMatch(key: Key) {
    navigate({ search: (prev) => ({ ...prev, nr: Number(key) }) });
  }

  const { data: players } = useSuspenseQuery(playersQuery(championship.id));
  const {
    data: { tips },
  } = useSuspenseQuery(matchTipsQuery(championship.id, match.nr));

  const {
    data: { matches, rounds, teams },
  } = useSuspenseQuery(matchesQuery(championship.id));

  const matchTips = useMemo(
    () => players.map((p) => tips[p.id] || { playerId: p.id }),
    [players, tips],
  );

  const columns = useMemo(
    () =>
      [
        columnHelper.accessor('playerId', {
          header: 'Spieler',
          cell: (info) =>
            players.find((p) => p.id === info.getValue())?.account.name,
        }),
        columnHelper.accessor('tip', {
          header: 'Tipp',
        }),
        columnHelper.accessor('points', {
          header: 'Punkte',
        }),
      ] as ColumnDef<Tip>[],
    [players],
  );

  return (
    <div>
      <div>
        <Select
          aria-label="Spielauswahl"
          name="match"
          defaultSelectedKey={match.nr}
          onSelectionChange={selectMatch}
          items={rounds}
        >
          {(r) => (
            <ListBoxSection id={r.id}>
              <Header className="px-1 pt-4 text-gray-11/85 text-sm">
                Runde {r.nr}
              </Header>
              <Collection items={matches.filter((m) => m.roundId === r.id)}>
                {(m) => {
                  const matchStr = `${teams[m.hometeamId]?.shortname || '(noch offen)'} - ${teams[m.awayteamId]?.shortname || '(noch offen)'}`;
                  return (
                    <ListBoxItem id={m.nr} textValue={matchStr}>
                      {({ isSelected }) => (
                        <>
                          <span>{matchStr}</span>
                          {isSelected && <CheckIcon className="size-5" />}
                        </>
                      )}
                    </ListBoxItem>
                  );
                }}
              </Collection>
            </ListBoxSection>
          )}
        </Select>
      </div>
      <div>
        <DataTable columns={columns} data={matchTips} />
      </div>
    </div>
  );
}
