import type { ChampionshipRules } from '../model/championchip-rules';
import type { Match } from '../model/match';
import type { Tip } from '../model/tip';
import { calculateTipResult } from './calculate-tip-result';

export function calculateMatchResults(
  originalMatch: Match,
  originalTips: Tip[],
  rules: ChampionshipRules,
  options: { isDoubleRound?: boolean } = {},
): { match: Match; tips: Tip[] } {
  const isDoubleRound =
    rules.roundRuleId === 'alles-verdoppelt' && !!options.isDoubleRound;

  let match = originalMatch;
  let tips = originalTips.map((t) =>
    calculateTipResult(t, match.result, rules.tipRuleId, {
      doubleRound: isDoubleRound,
    }),
  );

  const tipsWithPoints = tips.filter((t) => t.points > 0);
  let totalPoints = tipsWithPoints.reduce((sum, t) => sum + t.points, 0);

  switch (rules.matchRuleId) {
    case 'alleiniger-treffer-drei-punkte': {
      if (tipsWithPoints.length === 1) {
        const correctTip = tipsWithPoints[0];
        tips = tips.map((t) =>
          t !== correctTip
            ? t
            : {
                ...correctTip,
                points: correctTip.points + 3,
                lonelyHit: true,
              },
        );
        totalPoints += 3;
      }
      break;
    }

    default:
      break;
  }

  if (match.points !== totalPoints) {
    match = { ...match, points: totalPoints };
  }

  return { match, tips };
}
