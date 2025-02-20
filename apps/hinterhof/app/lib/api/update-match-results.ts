import { invariant } from '@/utils/invariant';
import { currentChampionshipAtom } from '@/utils/state/current-championship/championship';
import { store } from '@/utils/store';
import type { Id, Result, Tip } from '@haus23/tipprunde-model';
import { collection, filter } from '../firebase/repository';
import { updateRanking } from './update-ranking';
import { updateTipOutcome } from './update-tip-outcome';

export async function updateMatchResult(matchId: Id, result: Result) {
  console.log(`Update match ${matchId} result: ${result}`);

  const currentChampionship = store.get(currentChampionshipAtom);
  invariant(currentChampionship);

  // TODO: Can we cache tips? Put them into atom?
  console.log('Evaluate tips fetching');
  const tips = await collection<Tip>(
    `championships/${currentChampionship.id}/tips`,
    filter('matchId', '==', matchId),
  ).get();

  for (const tip of tips) {
    await updateTipOutcome(tip, result);
  }

  await updateRanking();
}
