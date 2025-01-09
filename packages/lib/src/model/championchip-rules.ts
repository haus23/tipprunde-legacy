import type { BaseModel } from './base/model';
import type { ExtraQuestionRuleId } from './rules/extra-question-rule';
import type { MatchRuleId } from './rules/match-rule';
import type { RoundRuleId } from './rules/round-rule';
import type { TipRuleId } from './rules/tip-rule';

export type ChampionshipRules = BaseModel & {
  name: string;
  description: string;
  tipRuleId: TipRuleId;
  matchRuleId: MatchRuleId;
  roundRuleId: RoundRuleId;
  extraQuestionRuleId: ExtraQuestionRuleId;
};
