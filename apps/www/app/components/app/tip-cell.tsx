import type { Tip } from '@haus23/tipprunde-model';
import { Infotip } from '#/components/ui/infotip';
import { TableCell } from '#/components/ui/table';

// Table cell with a tip, centered, and an infotip for a joker or the only
// correct tip; without a tip a muted dash. The infotip hangs right of the
// tip, out of the flow, so the tips stay aligned throughout the column.
export function TipCell({ tip }: { tip: Partial<Tip> | undefined }) {
  return (
    <TableCell className="px-6 text-center tabular-nums md:px-6">
      {tip?.tip ? (
        <span className="relative">
          {tip.tip}
          {(tip.joker || tip.lonelyHit) && (
            <Infotip
              label="Zusatzinfos zum Tipp"
              className="absolute top-1/2 left-full ml-0.5 -translate-y-1/2"
            >
              {tip.joker === true && <p>Joker</p>}
              {tip.lonelyHit === true && <p>Einziger richtiger Tipp</p>}
            </Infotip>
          )}
        </span>
      ) : (
        <NoTip />
      )}
    </TableCell>
  );
}

// Muted dash for a missing tip, announced as "kein Tipp".
export function NoTip() {
  return (
    <span className="text-muted-foreground">
      <span aria-hidden="true">–</span>
      <span className="sr-only">kein Tipp</span>
    </span>
  );
}
