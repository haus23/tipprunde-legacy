import type { RuleSet } from '../../rules/rule-set';
import type { Match } from '../match';
import type { Tip } from '../tip';
import { calculateTipResult } from './calculate-tip-result';

export function calculateMatchResults(
  originalMatch: Match,
  originalTips: Tip[],
  rules: RuleSet,
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

  if (match.result.length === 0) {
    if (typeof match.points !== 'undefined') {
      const { points: _, ...matchWithoutPoints } = match;
      match = matchWithoutPoints;
    }
    return { match, tips };
  }

  const tipsWithPoints = tips.filter(
    (tip): tip is Tip & { points: number } => (tip.points ?? 0) > 0,
  );
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
