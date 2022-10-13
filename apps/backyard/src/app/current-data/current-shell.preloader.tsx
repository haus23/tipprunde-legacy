import { useChampionshipPlayers } from '@/hooks/current-data/use-championship-players';
import { useRounds } from '@/hooks/current-data/use-rounds';

export default function CurrentShellPreloader() {
  useChampionshipPlayers();
  useRounds();

  return null;
}
