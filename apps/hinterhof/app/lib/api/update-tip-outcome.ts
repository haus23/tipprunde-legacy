import type { Result, Tip } from '@haus23/tipprunde-model';

export async function updateTipOutcome(tip: Tip, matchResult: Result) {
  console.log(`Update outcome of tip ${tip.tip} for result ${matchResult}`);
}
