import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { ClipboardListIcon } from 'lucide-react';
import { Suspense } from 'react';

import { EmptyView } from '#/components/app/empty-view';
import { Link } from '#/components/ui/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table';
import { useChampionship } from '#/utils/app/championship';
import { currentTipsQuery, playersQuery } from '#/utils/queries';
import { CurrentTips } from './-current-tips';

export const Route = createFileRoute('/$turnier/')({
  loader: async ({ context: { queryClient, championship } }) => {
    queryClient.prefetchQuery(currentTipsQuery(championship));
  },
  component: RankingComponent,
});

function RankingComponent() {
  const championship = useChampionship();
  const ranking = useSuspenseQuery(playersQuery(championship.id));
  const currentTips = useSuspenseQuery(currentTipsQuery(championship));
  const hasRanking = ranking.data.some((player) => player.rank !== undefined);
  const hasCurrentTips = currentTips.data.length > 0;

  const showExtraPoints =
    hasRanking && (championship.completed || championship.extraPointsPublished);
  const showCurrentTips =
    !championship.completed && (hasRanking || hasCurrentTips);

  return (
    <div>
      <div className="mx-4 sm:mx-0">
        <h1 className="font-medium text-xl">
          <span className="hidden md:inline">{championship.name} - </span>
          <span>
            {hasRanking
              ? championship.completed
                ? 'Abschlusstabelle'
                : 'Aktuelle Tabelle'
              : 'Mitspieler'}
          </span>
        </h1>
      </div>
      <div className="mt-4">
        {ranking.data.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                {hasRanking && (
                  <TableHead className="text-right">Platz</TableHead>
                )}
                <TableHead className="text-left md:pl-6">Name</TableHead>
                {showExtraPoints && (
                  <TableHead>
                    <span className="hidden sm:inline">Zusatzpunkte</span>
                    <span className="sm:hidden">Zusatzpkt</span>
                  </TableHead>
                )}
                {hasRanking && (
                  <TableHead>
                    <span className="hidden sm:inline">
                      {championship.extraPointsPublished
                        ? 'Gesamtpunkte'
                        : 'Punkte'}
                    </span>
                    <span className="sm:hidden">
                      {championship.extraPointsPublished ? 'Gesamt' : 'Punkte'}
                    </span>
                  </TableHead>
                )}
                {showCurrentTips && <TableHead>Tipps</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {ranking.data.map((player, ix) => (
                <TableRow key={player.id}>
                  {hasRanking && (
                    <TableCell className="text-right tabular-nums">
                      {player.rank === undefined
                        ? '–'
                        : // Shared ranks show the number only once
                          player.rank === (ranking.data[ix - 1]?.rank || 0)
                          ? ''
                          : `${player.rank}.`}
                    </TableCell>
                  )}
                  <TableCell className="w-full font-medium">
                    <Link
                      className="block py-1"
                      to="/$turnier/spieler"
                      params={{ turnier: championship.id }}
                      search={(prev) => ({ ...prev, name: player.playerId })}
                    >
                      {player.account.name}
                    </Link>
                  </TableCell>
                  {showExtraPoints && (
                    <TableCell className="text-center tabular-nums">
                      {player.extraPoints || ''}
                    </TableCell>
                  )}
                  {hasRanking && (
                    <TableCell className="text-center tabular-nums">
                      {player.totalPoints ?? ''}
                    </TableCell>
                  )}
                  {showCurrentTips && (
                    <TableCell>
                      <Suspense
                        fallback={
                          <div className="p-1.5 text-muted-foreground">
                            <ClipboardListIcon
                              className="size-5"
                              aria-hidden="true"
                            />
                          </div>
                        }
                      >
                        <CurrentTips player={player} />
                      </Suspense>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyView>Noch keine Mitspieler.</EmptyView>
        )}
      </div>
    </div>
  );
}
