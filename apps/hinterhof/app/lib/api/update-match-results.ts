import type { Id, Match, Result, Tip } from '@haus23/tipprunde-model';

import { invariant } from '@/utils/invariant';
import { currentChampionshipAtom } from '@/utils/state/current-championship/championship';
import { matchesAtom } from '@/utils/state/current-championship/matches';
import { roundsAtom } from '@/utils/state/current-championship/rounds';
import { rulesetAtom } from '@/utils/state/current-championship/ruleset';
import { tipsAtom } from '@/utils/state/current-championship/tips';
import { store } from '@/utils/store';

import { patchEntity } from '../firebase/repository';
import { clearCache } from '../unterbau/clear-cache';
import { updateRanking } from './update-ranking';
import { updateTipOutcome } from './update-tip-outcome';

export async function updateMatchResult(matchId: Id, result: Result) {
  console.log(`Update match ${matchId} result: ${result}`);

  const championship = store.get(currentChampionshipAtom);
  const ruleset = store.get(rulesetAtom);
  const match = store
    .get(matchesAtom(championship.id))
    .matches.find((m) => m.id === matchId);
  invariant(match);
  const round = store
    .get(roundsAtom(championship.id))
    .rounds.find((r) => r.id === match.roundId);
  invariant(round);

  const { tips: championshipTips } = store.get(tipsAtom(championship.id));
  const tips = championshipTips.filter((t) => t.matchId === matchId);

  const updatedTips = await Promise.all(
    tips.map((t) => updateTipOutcome(t, result, round)),
  );

  if (ruleset.matchRuleId === 'alleiniger-treffer-drei-punkte') {
    const lonelyHitBefore = updatedTips.find((t) => t.lonelyHit);
    const tipsWithPoints = updatedTips.filter((t) => t.points > 0);
    const lonelyHitAfter =
      tipsWithPoints.length === 1 ? tipsWithPoints[0] : null;

    if (lonelyHitAfter) {
      await patchEntity<Tip>(
        `championships/${championship.id}/tips`,
        lonelyHitAfter,
        {
          points: lonelyHitAfter.points + 3,
          lonelyHit: true,
        },
      );
      lonelyHitAfter.points += 3;
    }
    if (lonelyHitBefore && lonelyHitBefore !== lonelyHitAfter) {
      await patchEntity<Tip>(
        `championships/${championship.id}/tips`,
        lonelyHitBefore,
        {
          lonelyHit: false,
        },
      );
    }
  }

  const points = updatedTips.reduce((sum, elt) => sum + elt.points, 0);

  await patchEntity<Match>(
    `championships/${championship.id}/matches`,
    matchId,
    { result, points },
  );

  await updateRanking();

  clearCache(championship.id);
}
