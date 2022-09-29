import { TipRuleId } from '../model/rules/tip-rule';
import { Tip } from '../model/tip';

function toGoalTuple(result: string) {
  const goals = result.split(':');
  return goals.map((g) => Number(g));
}

function toTotoResult(goals: number[]) {
  const diff = goals[0] - goals[1];
  return diff && (diff > 0 ? 1 : 2);
}

/**
 * @returns Unmodified tip or updated copy.
 */
export function calculateTipResult(
  tip: Tip,
  result: string,
  ruleId: TipRuleId
): Tip {
  // Remove all extra flags if any
  if (typeof tip.lonelyHit !== 'undefined') {
    const { lonelyHit, ...cleanedCopy } = { ...tip };
    tip = cleanedCopy;
    if (Object.keys(tip).length !== 6) {
      throw Error('Unexpected props found on tip');
    }
  }

  let points = 0;

  // Empty tip with joker?
  if (tip.tip.length === 0 && tip.joker) {
    tip = { ...tip, joker: false };
  }

  if (tip.tip.length > 0 && result.length > 0) {
    const tipGoals = toGoalTuple(tip.tip);
    const resultGoals = toGoalTuple(result);
    const tipToto = toTotoResult(tipGoals);
    const resultToto = toTotoResult(resultGoals);
    const tipDiff = tipGoals[0] - tipGoals[1];
    const resultDiff = resultGoals[0] - resultGoals[1];

    switch (ruleId) {
      case 'drei-oder-ein-punkt-joker-verdoppelt':
        if (tipToto === resultToto) {
          points = 1;
        }
        break;
      case 'drei-zwei-oder-ein-punkt-joker-verdoppelt':
        if (tipToto === resultToto) {
          points = 1;
          if (tipDiff === resultDiff) {
            points = 2;
          }
        }
      default:
        break;
    }

    if (tipGoals[0] === resultGoals[0] && tipGoals[1] === resultGoals[1]) {
      points = 3;
    }

    if (tip.joker) {
      points *= 2;
    }
  }

  if (tip.points === points) {
    return tip;
  }

  return { ...tip, points: points };
}
