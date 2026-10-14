import type { Tip } from '@haus23/tipprunde-model';
import { Popover } from '#/components/ui/popover';
import { TableCell } from '#/components/ui/table';

// Table cell with a tip, centered, and an info popover next to it for a
// joker or the only correct tip.
export function TipCell({ tip }: { tip: Partial<Tip> | undefined }) {
  return (
    <TableCell className="px-6 tabular-nums md:px-6">
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
                {tip.joker === true && <p>Joker</p>}
                {tip.lonelyHit === true && <p>Einziger richtiger Tipp</p>}
              </div>
            </Popover>
          )}
        </span>
      </div>
    </TableCell>
  );
}
