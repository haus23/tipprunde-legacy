import type { ChampionshipPlayer } from '@haus23/tipprunde-model';
import {
  createEntityWithGeneratedId,
  patchEntity,
  updateEntity,
} from '#/firebase/write';
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
    const championshipPlayer: Omit<ChampionshipPlayer, 'id'> = {
      nr: lastNr + 1,
      playerId: playerId,
    };
    return createEntityWithGeneratedId<ChampionshipPlayer>(
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

  const removeChampionshipPlayerRanking = (player: ChampionshipPlayer) => {
    const playerWithoutRanking: ChampionshipPlayer = {
      id: player.id,
      playerId: player.playerId,
      nr: player.nr,
      ...(player.extraPoints === undefined
        ? {}
        : { extraPoints: player.extraPoints }),
    };
    return updateEntity(
      `championships/${currentChampionship?.id}/players`,
      playerWithoutRanking,
    );
  };

  return {
    championshipPlayers,
    addChampionshipPlayer,
    updateChampionshipPlayer,
    removeChampionshipPlayerRanking,
  };
}
