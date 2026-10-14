import { Navigate } from 'react-router';
import { useMasterDataStore } from '#/state/master-data-store';
import { useSessionStore } from '#/state/session-store';

// Entry point: continue with the last visited championship, else the latest.
// Without any championship, start with creating one.
export default function Start() {
  const championships = useMasterDataStore((state) => state.championships);
  const lastChampionshipId = useSessionStore(
    (state) => state.currentChampionshipId,
  );
  const championship =
    championships.find(({ id }) => id === lastChampionshipId) ??
    championships.at(0);

  return (
    <Navigate
      to={championship ? `/${championship.id}` : '/neues-turnier'}
      replace
    />
  );
}
