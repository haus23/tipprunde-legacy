import { useRouteLoaderData } from 'react-router-dom';
import { Championship } from 'lib';

export function useCurrentChampionship() {
  const { currentChampionship } = useRouteLoaderData('root') as {
    currentChampionship: Championship | null | undefined;
  };
  return currentChampionship;
}
