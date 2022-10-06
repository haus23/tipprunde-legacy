import { championshipPlayersState } from '@/state/current-data/championship-players-state';
import { ChampionshipPlayer, createEntity } from 'lib';
import { useRecoilValue } from 'recoil';
import { useCurrentChampionship } from './use-current-championship';

export function useChampionshipPlayers() {
  const { currentChampionship } = useCurrentChampionship();
  const championshipPlayers = useRecoilValue(
    championshipPlayersState(currentChampionship?.id)
  );

  const lastNr = championshipPlayers.reduce(
    (nr, p) => (p.nr > nr ? p.nr : nr),
    0
  );

  const addChampionshipPlayer = (playerId: string) => {
    const championshipPlayer: ChampionshipPlayer = {
      id: '',
      nr: lastNr + 1,
      playerId: playerId,
      points: 0,
      extraPoints: 0,
      totalPoints: 0,
      rank: 0,
    };
    return createEntity<ChampionshipPlayer>(
      `championships/${currentChampionship?.id}/players`,
      championshipPlayer
    );
  };

  return { championshipPlayers, addChampionshipPlayer };
}
