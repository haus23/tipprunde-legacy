import { useRecoilValue } from 'recoil';
import { rulesState } from '@/states/domain/rules-state';
import { ChampionshipRules, createEntity, updateEntity } from 'lib';

export function useRules() {
  const rules = useRecoilValue(rulesState);

  const createRules = (rules: ChampionshipRules) =>
    createEntity<ChampionshipRules>('rules', rules);

  const updateRules = (rules: ChampionshipRules) =>
    updateEntity('rules', rules);

  return { rules, createRules, updateRules };
}
