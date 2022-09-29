import { ChampionshipRules } from '../model/championchip-rules';
import { Match } from '../model/match';
import { Tip } from '../model/tip';
import { calculateTipResult } from './calculate-tip-result';

export function calculateMatchResults(
  match: Match,
  tips: Tip[],
  rules: ChampionshipRules
): { match: Match; tips: Tip[] } {
  tips = tips.map((t) => calculateTipResult(t, match.result, rules.tipRuleId));

  const tipsWithPoints = tips.filter((t) => t.points > 0);
  let totalPoints = tipsWithPoints.reduce((sum, t) => sum + t.points, 0);

  switch (rules.matchRuleId) {
    case 'alleiniger-treffer-drei-punkte':
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
