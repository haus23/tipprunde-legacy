import { useRouteLoaderData } from 'react-router-dom';

export function useChampionships() {
  const { championships } = useRouteLoaderData('app');
  return championships;
}
