import { useChampionships } from '@/hooks/master-data/use-championships';
import { useLeagues } from '@/hooks/master-data/use-leagues';
import { usePlayers } from '@/hooks/master-data/use-players';
import { useRules } from '@/hooks/master-data/use-rules';
import { useTeams } from '@/hooks/master-data/use-teams';

export default function AppPreloader() {
  useChampionships();
  usePlayers();
  useTeams();
  useLeagues();
  useRules();

  return null;
}
