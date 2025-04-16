import type { PlayerWithAccount } from '@haus23/tipprunde-model';
import { useSuspenseQuery } from '@tanstack/react-query';
import { CalendarIcon } from 'lucide-react';
import { Fragment } from 'react';

import { Link } from '#/components/ui/link';
import { Popover } from '#/components/ui/popover';
import { useChampionship } from '#/utils/app/championship';
import { currentTipsQuery, matchesQuery } from '#/utils/queries';

export function CurrentTips({ player }: { player: PlayerWithAccount }) {
  const championship = useChampionship();
  const { data: currentTips } = useSuspenseQuery(
    currentTipsQuery(championship),
  );

  // TODO: unterbau should return the match nr with the currentTips-Query.
  // See line 114 and issue #35
  const {
    data: { matches },
  } = useSuspenseQuery(matchesQuery(championship.id));

  return (
    <Popover triggerIcon={CalendarIcon} triggerLabel="Aktuelle Tips anzeigen">
      <div className="grid w-[240px] grid-cols-[1fr_repeat(2,auto)] pb-1 text-sm">
        <div className="border-b p-2 pr-0">Spiel</div>
        <div className="border-b p-2 text-center">Tipp</div>
        <div className="border-b p-2 text-center">Pkt</div>
        {currentTips.map((m) => {
          const tip = m.tips[player.id];
          return (
            <Fragment key={m.matchId}>
              <Link
                to="/$turnier/spiel"
                params={{ turnier: championship.id }}
                search={(prev) => ({
                  ...prev,
                  nr: matches.find((match) => match.id === m.matchId)?.nr,
                })}
                className={[
                  'py-1 pl-2',
                  (tip?.joker || tip?.lonelyHit) && 'bg-accent-3',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {!m.hometeam && !m.awayteam
                  ? '(noch offen)'
                  : `${m.hometeam || '(noch offen)'} - ${m.awayteam || '(noch offen)'}`}
              </Link>
              <div
                className={[
                  'py-1 text-center',
                  (tip?.joker || tip?.lonelyHit) && 'bg-accent-3',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {tip?.tip}
              </div>
              <div
                className={[
                  'py-1 text-center',
                  (tip?.joker || tip?.lonelyHit) && 'bg-accent-3',
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
    </Popover>
  );
}
