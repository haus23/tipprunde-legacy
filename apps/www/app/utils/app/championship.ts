import { useMatch, useRouteContext } from '@tanstack/react-router';

// The championship of the current route. Outside of a championship route,
// e.g. on a not found page, the latest championship.
export function useChampionship() {
  const match = useMatch({ from: '/$turnier', shouldThrow: false });
  const { championships } = useRouteContext({ from: '__root__' });
  return match?.loaderData?.championship ?? championships[0];
}
