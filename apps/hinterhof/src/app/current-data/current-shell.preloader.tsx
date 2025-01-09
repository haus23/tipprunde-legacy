import { useChampionshipPlayers } from '@/hooks/current-data/use-championship-players';
import { useMatches } from '@/hooks/current-data/use-matches';
import { useRounds } from '@/hooks/current-data/use-rounds';

export default function CurrentShellPreloader() {
  useChampionshipPlayers();
  useRounds();
  useMatches();

  return null;
}
