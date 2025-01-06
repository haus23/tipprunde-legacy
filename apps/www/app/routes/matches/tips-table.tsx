import type { Match, Player, Tip } from '@haus23/tipprunde-types';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/24/outline';

import { Button } from '#/components/(ui)/atoms/button';
import { Link } from '#/components/(ui)/atoms/link';
import { InfoBox } from '#/components/(ui)/molecules/info-box';
import { useTipSorting } from '#/utils/app/tip-sorting';

export function TipsTable({
  players,
  match,
  tips,
}: { players: Player[]; match: Match; tips: Record<string, Tip> }) {
  const { column, order, toggleSort, sortFn } = useTipSorting();

  const tipsByPlayer = players.map((p) => ({ player: p, tip: tips[p.id] }));

  return (
    <table className="w-full text-sm">
      <thead className="bg-accent-subtle text-xs  text-accent-foreground">
        <tr>
          <th
            aria-sort={column === 'name' ? order : 'none'}
            scope="col"
            className="w-full px-2 py-3 text-left font-medium sm:px-4 md:px-6"
          >
            <Button
              type="button"
              className="relative p-1 pr-4 rounded-sm"
              aria-label="Sortierung ändern"
              onClick={() => toggleSort('name')}
            >
              <span className="uppercase">Spieler</span>
              {column !== 'name' || order === 'none' ? (
                <ChevronUpDownIcon className="absolute right-0 size-4" />
              ) : order === 'descending' ? (
                <ArrowDownIcon className="absolute right-0.5 size-3" />
              ) : (
                <ArrowUpIcon className="absolute right-0.5 size-3" />
              )}
            </Button>
          </th>
          <th
            aria-sort={column === 'tip' ? order : 'none'}
            scope="col"
            className="px-2 text-center font-medium sm:px-4 md:px-6"
          >
            <Button
              type="button"
              className="relative p-1 pr-4 rounded-sm"
              aria-label="Sortierung ändern"
              onClick={() => toggleSort('tip')}
            >
              <span className="uppercase">Tipp</span>
              {column !== 'tip' || order === 'none' ? (
                <ChevronUpDownIcon className="absolute right-0 size-4" />
              ) : order === 'descending' ? (
                <ArrowDownIcon className="absolute right-0.5 size-3" />
              ) : (
                <ArrowUpIcon className="absolute right-0.5 size-3" />
              )}
            </Button>
          </th>
          <th
            aria-sort={column === 'points' ? order : 'none'}
            scope="col"
            className="px-2 text-center font-medium sm:px-4 md:px-6"
          >
            <Button
              type="button"
              className="relative p-1 pr-4 rounded-sm"
              aria-label="Sortierung ändern"
              onClick={() => toggleSort('points')}
            >
              <span className="uppercase">Punkte</span>
              {column !== 'points' || order === 'none' ? (
                <ChevronUpDownIcon className="absolute right-0 size-4" />
              ) : order === 'descending' ? (
                <ArrowDownIcon className="absolute right-0.5 size-3" />
              ) : (
                <ArrowUpIcon className="absolute right-0.5 size-3" />
              )}
            </Button>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-hover font-semibold text-subtle-foreground">
        {tipsByPlayer.sort(sortFn).map(({ player, tip }) => {
          const highlighted = tip?.joker || tip?.lonelyHit || false;

          return (
            <tr
              className={highlighted ? 'bg-primary-active' : ''}
              key={player.id}
            >
              <td className="w-full px-2 sm:px-4 md:px-6 ">
                <div className="py-1.5">
                  <Link
                    prefetch="viewport"
                    to={`../spieler?name=${player.playerId}`}
                    className={`inline-block w-full p-1 rounded-sm data-[hovered]:text-accent-foreground data-[hovered]:underline ${highlighted ? 'data-[focus-visible]:ring-offset-primary-active' : ''}`}
                  >
                    {player.account.name}
                  </Link>
                </div>
              </td>
              <td className="relative pl-2 pr-6 text-center sm:pl-4 md:pl-6">
                <span>{tip?.tip}</span>
                {highlighted && (
                  <span className="absolute right-0">
                    <InfoBox
                      align="end"
                      side="top"
                      ariaTriggerLabel="Zusatzinfos zum Tipp"
                    >
                      <div className="px-4 py-2">
                        {tip?.joker === true && <p>Joker</p>}
                        {tip?.lonelyHit === true && (
                          <p>Einziger richtiger Tipp</p>
                        )}
                      </div>
                    </InfoBox>
                  </span>
                )}
              </td>
              <td className="px-2 text-center sm:px-4 md:px-6">
                {match?.result && tip?.points}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
