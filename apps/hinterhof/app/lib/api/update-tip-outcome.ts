import type { Result, Round, Tip } from '@haus23/tipprunde-model';

import { invariant } from '@/utils/invariant';
import { currentChampionshipAtom } from '@/utils/state/current-championship/championship';
import { rulesetAtom } from '@/utils/state/current-championship/ruleset';
import { store } from '@/utils/store';
import { patchEntity } from '../firebase/repository';

function toGoalTuple(result: string) {
  const goals = result.split(':');
  return goals.map((g) => Number(g));
}

function toTotoResult(goals: number[]) {
  const diff = goals[0] - goals[1];
  return diff && (diff > 0 ? 1 : 2);
}

export async function updateTipOutcome(
  tip: Tip,
  matchResult: Result,
  round: Round,
) {
  const ruleset = store.get(rulesetAtom);
  const championship = store.get(currentChampionshipAtom);

  let points = 0;

  if (tip.tip && matchResult) {
    // Should be handled by creating this values
    invariant(tip.tip.trim() === tip.tip);
    invariant(matchResult.trim() === matchResult);

    if (tip.tip === matchResult) {
      points = 3;
    } else {
      const tipGoals = toGoalTuple(tip.tip);
      const resultGoals = toGoalTuple(matchResult);
      const tipToto = toTotoResult(tipGoals);
      const resultToto = toTotoResult(resultGoals);
      const tipDiff = tipGoals[0] - tipGoals[1];
      const resultDiff = resultGoals[0] - resultGoals[1];

      switch (ruleset.tipRuleId) {
        case 'drei-oder-ein-punkt-joker-verdoppelt': {
          if (tipToto === resultToto) {
            points = 1;
          }
          break;
        }
        case 'drei-zwei-oder-ein-punkt-joker-verdoppelt': {
          if (tipToto === resultToto) {
            points = 1;
            if (tipDiff === resultDiff) {
              points = 2;
            }
          }
          break;
        }
      }

      if (tip.joker) {
        points *= 2;
      }

      if (round.isDoubleRound) {
        points *= 2;
      }
    }
  }

  if (tip.points !== points) {
    await patchEntity<Tip>(`championships/${championship.id}/tips`, tip, {
      points,
    });

    return { ...tip, points };
  }

  return tip;
}
