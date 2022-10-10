import { useChampionshipPlayers } from '@/hooks/current-data/use-championship-players';

export default function CurrentShellPreloader() {
  useChampionshipPlayers();

  return null;
}
