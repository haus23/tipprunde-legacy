import { Championship } from 'lib';
import { useRouteLoaderData } from 'react-router-dom';

export function useChampionships() {
  const { championships } = useRouteLoaderData('root') as {
    championships: Championship[];
  };
  return championships;
}
