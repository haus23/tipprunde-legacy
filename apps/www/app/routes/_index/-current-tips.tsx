import type { PlayerWithAccount } from '@haus23/tipprunde-model';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useLoaderData } from '@tanstack/react-router';
import { CalendarIcon } from 'lucide-react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { OverlayArrow, Popover } from 'react-aria-components';
import { tv } from 'tailwind-variants';

import { Button } from '#/components/ui/button';
import { Link } from '#/components/ui/link';
import { currentTipsQuery, matchesQuery } from '#/utils/queries';

const popoverStyles = tv({
  base: [
    'group rounded-md border bg-background shadow-md dark:bg-gray-2',
    'data-[placement=bottom]:mb-1.5 data-[placement=top]:translate-y-1',
    'data-[placement=bottom]:-translate-y-2 data-[placement=bottom]:mt-1.5',
    'data-[placement=left]:mr-1.5 data-[placement=left]:translate-x-2',
    'data-[placement=left]:-translate-x-2 data-[placement=right]:ml-1.5',
  ],
});
const overlayArrowStyles = tv({
  base: [
    'block fill-background stroke-1 stroke-gray-6',
    'group-data-[placement=bottom]:rotate-180',
    'group-data-[placement=left]:-rotate-90',
    'group-data-[placement=left]:rotate-90',
  ],
});

export function CurrentTips({ player }: { player: PlayerWithAccount }) {
  const { championship } = useLoaderData({ from: '__root__' });
  const { data: currentTips } = useSuspenseQuery(
    currentTipsQuery(championship),
  );

  // TODO: unterbau should return the match nr with the currentTips-Query.
  // See line 114 and issue #35
  const {
    data: { matches },
  } = useSuspenseQuery(matchesQuery(championship.id));

  const [isOpen, setOpen] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isOpen) {
      function handleOutsideClick(ev: PointerEvent) {
        if (
          triggerRef.current &&
          !triggerRef.current.contains(ev.target as Node) &&
          popoverRef.current &&
          !popoverRef.current.contains(ev.target as Node)
        ) {
          setOpen(false);
        }
      }
      window.addEventListener('pointerdown', handleOutsideClick, {
        capture: true,
      });

      return () => {
        window.removeEventListener('pointerdown', handleOutsideClick, {
          capture: true,
        });
      };
    }
  }, [isOpen]);

  return (
    <>
      <Button
        ref={triggerRef}
        onPress={() => setOpen(!isOpen)}
        variant="plain"
        className="p-1.5 text-gray-11"
      >
        <CalendarIcon className="size-5" />
      </Button>
      <Popover
        ref={popoverRef}
        triggerRef={triggerRef}
        isOpen={isOpen}
        onOpenChange={setOpen}
        isNonModal
        offset={4}
        className={popoverStyles()}
      >
        <OverlayArrow>
          <svg
            role="img"
            aria-label="Arrow pointing to trigger"
            width={12}
            height={12}
            viewBox="0 0 12 12"
            className={overlayArrowStyles()}
          >
            <path d="M0 0 L6 6 L12 0" />
          </svg>
        </OverlayArrow>
        <div className="grid w-[240px] grid-cols-[1fr_repeat(2,auto)] pb-2 text-sm">
          <div className="border-b py-2 pl-2">Spiel</div>
          <div className="border-b p-2 text-center">Tipp</div>
          <div className="border-b p-2 text-center">Pkt</div>
          {currentTips.map((m) => {
            const tip = m.tips[player.id];
            return (
              <Fragment key={m.matchId}>
                <Link
                  to="/spiele"
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
    </>
  );
}
