import { Match } from '@/model/domain/match';
import { Ruleset } from '../ruleset';
import { Tip } from '../tip';
import { calculateTipResult } from './calculate-tip-result';

export type MatchRule =
  | 'KeineBesonderheiten'
  | 'AlleinigerTrefferGibtDreiPunkte';

export const matchRuleDescriptions: { name: MatchRule; description: string }[] =
  [
    {
      name: 'KeineBesonderheiten',
      description: `
      Es gibt keine Sonderregeln für einzelne Spiele.
    `,
    },
    {
      name: 'AlleinigerTrefferGibtDreiPunkte',
      description: `
      Falls ein Spieler als einziger für ein Spiel Punkte erhält bekommt er drei zusätzliche Punkte.
    `,
    },
  ];

export function calculateMatchResults(
  match: Match,
  tips: Tip[],
  ruleset: Ruleset
): { match: Match; tips: Tip[] } {
  tips = tips.map((t) => calculateTipResult(t, match.result, ruleset.tipRule));

  const tipsWithPoints = tips.filter((t) => t.points > 0);
  let totalPoints = tipsWithPoints.reduce((sum, t) => sum + t.points, 0);

  switch (ruleset.matchRule) {
    case 'AlleinigerTrefferGibtDreiPunkte':
      if (tipsWithPoints.length === 1) {
        const correctTip = tipsWithPoints[0];
        tips = tips.map((t) =>
          t !== correctTip
            ? t
            : {
                ...correctTip,
                points: correctTip.points + 3,
                lonelyHit: true,
              }
        );
        totalPoints += 3;
      }
      break;

    default:
      break;
  }

  if (match.points !== totalPoints) {
    match = { ...match, points: totalPoints };
  }

  return { match, tips };
}
