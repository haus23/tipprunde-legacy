import { useChampionships } from '@/hooks/domain/use-championships';
import { useLeagues } from '@/hooks/domain/use-leagues';
import { usePlayers } from '@/hooks/domain/use-players';
import { useRules } from '@/hooks/domain/use-rules';
import { useTeams } from '@/hooks/domain/use-teams';

export default function AppPreloader() {
  useChampionships();
  usePlayers();
  useTeams();
  useLeagues();
  useRules();

  return null;
}
