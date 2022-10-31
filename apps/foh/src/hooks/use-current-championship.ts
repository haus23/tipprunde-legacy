import { useRouteLoaderData } from 'react-router-dom';

export function useCurrentChampionship() {
  const { currentChampionship } = useRouteLoaderData('app');
  return currentChampionship;
}
