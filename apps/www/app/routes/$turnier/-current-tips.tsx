import type { ChampionshipPlayerWithAccount } from '@haus23/tipprunde-model';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ClipboardListIcon } from 'lucide-react';
import { NoTip } from '#/components/app/tip-cell';
import { Link } from '#/components/ui/link';
import { Popover } from '#/components/ui/popover';
import { useChampionship } from '#/utils/app/championship';
import { cn } from '#/utils/cn';
import { currentTipsQuery } from '#/utils/queries';

// The tips of a player for the current matches, behind an icon in the
// ranking table.
export function CurrentTips({
  player,
}: {
  player: ChampionshipPlayerWithAccount;
}) {
  const championship = useChampionship();
  const { data: currentTips } = useSuspenseQuery(
    currentTipsQuery(championship),
  );
  const title = `Aktuelle Tipps von ${player.account.name}`;
  const hasHighlights = currentTips.some((m) => {
    const tip = m.tips[player.id];
    return tip?.joker || tip?.lonelyHit;
  });

  return (
    <Popover triggerIcon={ClipboardListIcon} triggerLabel={title}>
      <div className="w-72 max-w-[calc(100vw-2rem)] text-sm">
        <p className="border-b px-3 py-2 font-medium">{title}</p>
        <table className="w-full">
          <thead className="text-muted-foreground text-xs uppercase">
            <tr>
              <th className="px-3 pt-2 pb-1 text-left font-medium">Spiel</th>
              <th className="px-2 pt-2 pb-1 font-medium">Tipp</th>
              <th className="px-3 pt-2 pb-1 text-right font-medium">Pkt</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentTips.map((m) => {
              const tip = m.tips[player.id];
              const highlighted = tip?.joker || tip?.lonelyHit;
              return (
                <tr
                  key={m.matchId}
                  className={cn(highlighted && 'bg-highlight')}
                >
                  <td className="py-0.5 pl-1">
                    <Link
                      to="/$turnier/spiel"
                      params={{ turnier: championship.id }}
                      search={{ nr: m.nr }}
                      className="block py-1"
                    >
                      {!m.hometeam && !m.awayteam
                        ? '(noch offen)'
                        : `${m.hometeam || '(noch offen)'} – ${m.awayteam || '(noch offen)'}`}
                    </Link>
                  </td>
                  <td className="px-2 text-center tabular-nums">
                    {tip?.tip ? (
                      <>
                        {tip.tip}
                        {tip.joker && <span className="sr-only"> (Joker)</span>}
                        {tip.lonelyHit && (
                          <span className="sr-only">
                            {' '}
                            (einziger richtiger Tipp)
                          </span>
                        )}
                      </>
                    ) : (
                      <NoTip />
                    )}
                  </td>
                  <td className="px-3 text-right tabular-nums">
                    {m.result && tip?.tip ? (tip.points ?? 0) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {hasHighlights && (
          <p className="border-t px-3 py-2 text-muted-foreground text-xs">
            <span
              className="mr-1.5 inline-block size-2.5 rounded-sm bg-highlight align-middle ring-1 ring-accent-border"
              aria-hidden="true"
            />
            Joker oder einziger richtiger Tipp
          </p>
        )}
      </div>
    </Popover>
  );
}
