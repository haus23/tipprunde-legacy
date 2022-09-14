import { BaseModel } from '@/firebase/db/base-model';

import { MatchRule } from './calculators/calculate-match-results';
import { RoundRule } from './calculators/calculate-round-results';
import { TipRule } from './calculators/calculate-tip-result';

export interface Ruleset extends BaseModel {
  name: string;
  tipRule: TipRule;
  matchRule: MatchRule;
  roundRule: RoundRule;
}
