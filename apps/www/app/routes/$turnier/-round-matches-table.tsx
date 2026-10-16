import type { Match, Team, Tip } from '@haus23/tipprunde-model';
import { TipCell } from '#/components/app/tip-cell';
import { Link } from '#/components/ui/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table';
import { formatDate } from '#/utils/misc';

// The matches of one round with the tips of a player.
export function RoundMatchesTable({
  championshipId,
  matches: matchesInRound,
  teams,
  tips,
}: {
  championshipId: string;
  matches: Match[];
  teams: Record<string, Team>;
  tips: Record<string, Tip>;
}) {
  return (
    <div className="py-1 text-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden sm:table-cell">Nr</TableHead>
            <TableHead className="hidden sm:table-cell">Datum</TableHead>
            <TableHead className="text-left max-sm:pl-4 md:pl-6">
              Spiel
            </TableHead>
            {/* Short headers on phones leave more room for the pairings */}
            <TableHead>
              <span className="sm:hidden" aria-hidden="true">
                Erg
              </span>
              <span className="max-sm:sr-only">Ergebnis</span>
            </TableHead>
            <TableHead className="px-6 md:px-6">Tipp</TableHead>
            <TableHead>
              <span className="sm:hidden" aria-hidden="true">
                Pkt
              </span>
              <span className="max-sm:sr-only">Punkte</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matchesInRound.map((match) => {
            const tip = tips[match.id];
            return (
              <TableRow key={match.id}>
                <TableCell className="hidden text-center tabular-nums sm:table-cell">
                  {match.nr}
                </TableCell>
                <TableCell className="hidden text-center tabular-nums sm:table-cell">
                  {formatDate(match.date, {
                    shortIfCurrent: true,
                  })}
                </TableCell>
                <TableCell className="w-full font-medium max-sm:pl-2">
                  <Link
                    to="/$turnier/spiel"
                    params={{ turnier: championshipId }}
                    search={{ nr: match.nr }}
                    className="block py-1"
                  >
                    <span className="hidden md:inline">
                      {`${teams[match.hometeamId]?.name || '(noch offen)'} – ${teams[match.awayteamId]?.name || '(noch offen)'}`}
                    </span>
                    <span className="md:hidden">
                      {`${teams[match.hometeamId]?.shortname || '(noch offen)'} – ${teams[match.awayteamId]?.shortname || '(noch offen)'}`}
                    </span>
                  </Link>
                </TableCell>
                <TableCell className="text-center tabular-nums">
                  {match.result}
                </TableCell>
                <TipCell tip={tip} />
                <TableCell className="text-center tabular-nums">
                  {match.result && tip?.tip ? (tip.points ?? 0) : undefined}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
