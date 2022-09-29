import { useRecoilValue } from 'recoil';
import { rulesetsState } from '@/states/domain/rulesets-state';
import { ChampionshipRules, createEntity, updateEntity } from 'lib';

export function useRulesets() {
  const rulesets = useRecoilValue(rulesetsState);

  const createRuleset = (ruleset: ChampionshipRules) =>
    createEntity<ChampionshipRules>('rules', ruleset);

  const updateRuleset = (ruleset: ChampionshipRules) =>
    updateEntity('rules', ruleset);

  return { rulesets, createRuleset, updateRuleset };
}
