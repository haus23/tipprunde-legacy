import { BaseModel } from './base/model';
import { ExtraQuestionRuleId } from './rules/extra-question-rule';
import { MatchRuleId } from './rules/match-rule';
import { RoundRuleId } from './rules/round-rule';
import { TipRuleId } from './rules/tip-rule';

export interface ChampionshipRules extends BaseModel {
  name: string;
  description: string;
  tipRuleId: TipRuleId;
  matchRuleId: MatchRuleId;
  roundRuleId: RoundRuleId;
  extraQuestionRuleId: ExtraQuestionRuleId;
}
