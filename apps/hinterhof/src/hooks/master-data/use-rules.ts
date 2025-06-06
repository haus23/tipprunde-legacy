import { rulesState } from '@/state/master-data/rules-state';
import { type ChampionshipRules, createEntity, updateEntity } from 'lib';
import { useRecoilValue } from 'recoil';

export function useRules() {
  const rules = useRecoilValue(rulesState);

  const createRules = (rules: ChampionshipRules) =>
    createEntity<ChampionshipRules>('rules', rules);

  const updateRules = (rules: ChampionshipRules) =>
    updateEntity('rules', rules);

  return { rules, createRules, updateRules };
}
