import type { Match } from '@haus23/tipprunde-model';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  createFileRoute,
  useLoaderData,
  useNavigate,
} from '@tanstack/react-router';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import type { Key } from 'react-aria-components';
import * as v from 'valibot';

import { CheckIcon, InfoIcon } from 'lucide-react';
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
} from '#/components/ui/accordion';
import { DataTable } from '#/components/ui/data-table';
import { Link } from '#/components/ui/link';
import { ListBoxItem } from '#/components/ui/listbox';
import { Popover } from '#/components/ui/popover';
import { Select } from '#/components/ui/select';
import { formatDate } from '#/utils/misc';
import { matchesQuery, playerTipsQuery, playersQuery } from '#/utils/queries';

const columnHelper = createColumnHelper<Match>();

export const Route = createFileRoute('/spieler_')({
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

    queryClient.prefetchQuery(
      playerTipsQuery(championship.id, player.account.id),
    );
    return { player };
  },
  component: PlayersComponent,
});

function PlayersComponent() {
  const { championship } = useLoaderData({ from: '__root__' });
  const navigate = useNavigate({ from: Route.fullPath });
  const { data: players } = useSuspenseQuery(playersQuery(championship.id));

  const { player } = Route.useLoaderData();
  function selectAccount(key: Key) {
    navigate({ search: (prev) => ({ ...prev, name: String(key) }) });
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

  const columns = useMemo(
    () =>
      [
        columnHelper.accessor('nr', {
          header: 'Nr',
          meta: {
            cellClasses: 'hidden sm:table-cell',
            tdClasses: 'text-center tabular-nums',
          },
        }),
        columnHelper.accessor('date', {
          header: 'Datum',
          cell: ({ cell }) =>
            formatDate(cell.getValue(), { shortIfCurrent: true }),
          meta: {
            cellClasses: 'hidden sm:table-cell',
            tdClasses: 'text-center tabular-nums',
          },
        }),
        columnHelper.display({
          id: 'match',
          header: 'Spiel',
          cell: ({ row }) => (
            <Link
              to="/spiele"
              search={(prev) => ({ ...prev, nr: row.original.nr })}
              className="block py-1"
            >
              <span className="hidden md:inline">
                {teams[row.original.hometeamId]?.name || '(noch offen)'} -
                {teams[row.original.awayteamId]?.name || '(noch offen)'}
              </span>
              <span className="md:hidden">
                {teams[row.original.hometeamId]?.shortname || '(noch offen)'} -
                {teams[row.original.awayteamId]?.shortname || '(noch offen)'}
              </span>
            </Link>
          ),
          meta: {
            thClasses: 'text-left md:pl-6',
            tdClasses: 'w-full font-medium',
          },
        }),
        columnHelper.accessor('result', {
          header: 'Ergebnis',
          meta: {
            tdClasses: 'text-center tabular-nums',
          },
        }),
        columnHelper.display({
          id: 'tip',
          header: 'Tipp',
          cell: ({ row }) => {
            const tip = tips.tips[row.original.id];
            return (
              <>
                <span>{tip?.tip}</span>
                {(tip?.joker || tip?.lonelyHit) && (
                  <span className="-right-2 -translate-y-1.5 absolute">
                    <Popover offset={4} triggerLabel="Zusatzinfos zum Tipp">
                      <div className="px-4 py-2">
                        {tip?.joker === true && <p>Joker</p>}
                        {tip?.lonelyHit === true && (
                          <p>Einziger richtiger Tipp</p>
                        )}
                      </div>
                    </Popover>
                  </span>
                )}
              </>
            );
          },
          meta: {
            cellClasses: 'px-6 md:px-6',
            tdClasses: 'relative text-center tabular-nums',
          },
        }),
        columnHelper.display({
          id: 'points',
          header: 'Punkte',
          cell: ({ row }) =>
            row.original.result && (tips.tips[row.original.id]?.points ?? 0),
          meta: {
            tdClasses: 'text-center tabular-nums',
          },
        }),
      ] as ColumnDef<Match>[],
    [teams, tips],
  );

  return (
    <div>
      <div className="mx-2 flex items-center gap-x-4 sm:mx-0">
        <h1 className="font-medium text-xl">
          <span className="hidden sm:inline">{championship.name} - </span>
          <span>Tipps von</span>
        </h1>
        <Select
          aria-label="Spielerauswahl"
          key={player.account.id}
          defaultSelectedKey={player.account.id}
          onSelectionChange={selectAccount}
          items={players}
        >
          {(p) => (
            <ListBoxItem id={p.account.id} textValue={p.account.name}>
              {({ isSelected }) => (
                <>
                  <span>{p.account.name}</span>
                  {isSelected && <CheckIcon className="size-5" />}
                </>
              )}
            </ListBoxItem>
          )}
        </Select>
      </div>
      <div className="mx-2 mt-6 text-sm md:mx-auto">
        <div className="flex w-full justify-between">
          <div className="space-y-1">
            <p className="font-medium text-gray-11 text-xs uppercase">Platz</p>
            <p className="text-center font-semibold">{`${player.rank}.`}</p>
          </div>
          <div className="space-y-1">
            <p className="px-4 font-medium text-gray-11 text-xs uppercase">
              Spiele
            </p>
            <p className="text-center font-semibold">{`${playedMatches} (${matches.length})`}</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-gray-11 text-xs uppercase">Punkte</p>
            <p className="text-center font-semibold">{player.points}</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-gray-11 text-xs uppercase">
              Schnitt
            </p>
            <p className="text-center font-semibold">{`${
              playedMatches ? (player.points / playedMatches).toFixed(2) : ''
            }`}</p>
          </div>
        </div>
      </div>
      <AccordionGroup
        allowsMultipleExpanded
        defaultExpandedKeys={[currentRoundId]}
        className="mt-6"
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
            <Accordion id={r.id} key={r.id}>
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
                      {(pointsInRound / playedMatchesInRoundCount).toFixed(2)}
                    </div>
                  </div>
                )}
              </AccordionSummary>
              <AccordionDetails className="animated-height mt-2">
                <DataTable
                  className="text-sm"
                  columns={columns}
                  data={matchesInRound}
                  getRowClasses={(row) => {
                    const tip = tips.tips[row.original.id];
                    return tip?.joker || tip?.lonelyHit ? 'bg-accent-4' : '';
                  }}
                />
              </AccordionDetails>
            </Accordion>
          );
        })}
      </AccordionGroup>
    </div>
  );
}
