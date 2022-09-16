import { BaseModel } from '@/firebase/db/base-model';

import { MatchRule } from './calculators/calculate-match-results';
import { RoundRule } from './calculators/calculate-round-results';
import { TipRule } from './calculators/calculate-tip-result';

export type ExtraQuestionRule = 'KeineZusatzfragen' | 'MitZusatzfragen';
export const extraQuestionDescriptions: {
  name: ExtraQuestionRule;
  description?: string;
}[] = [{ name: 'KeineZusatzfragen' }, { name: 'MitZusatzfragen' }];

export interface Ruleset extends BaseModel {
  name: string;
  description: string;
  tipRule: TipRule;
  matchRule: MatchRule;
  roundRule: RoundRule;
  extraQuestionRule?: ExtraQuestionRule;
}
