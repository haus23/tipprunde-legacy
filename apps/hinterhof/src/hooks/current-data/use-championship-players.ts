import { type ChampionshipPlayer, createEntity, patchEntity } from 'lib';
import { useCurrentDataStore } from '#/state/current-data-store';
import { useCurrentChampionship } from './use-current-championship';

export function useChampionshipPlayers() {
  const { currentChampionship } = useCurrentChampionship();
  const championshipPlayers = useCurrentDataStore(
    (state) => state.championshipPlayers,
  );

  const lastNr = championshipPlayers.reduce(
    (nr, p) => (p.nr > nr ? p.nr : nr),
    0,
  );

  const addChampionshipPlayer = (playerId: string) => {
    const championshipPlayer: ChampionshipPlayer = {
      id: '',
      nr: lastNr + 1,
      playerId: playerId,
      points: 0,
      extraPoints: 0,
      totalPoints: 0,
      rank: 1,
    };
    return createEntity<ChampionshipPlayer>(
      `championships/${currentChampionship?.id}/players`,
      championshipPlayer,
    );
  };

  const updateChampionshipPlayer = (
    playerId: string,
    changes: Partial<ChampionshipPlayer>,
  ) => {
    return patchEntity(
      `championships/${currentChampionship?.id}/players`,
      playerId,
      changes,
    );
  };
  return {
    championshipPlayers,
    addChampionshipPlayer,
    updateChampionshipPlayer,
  };
}
