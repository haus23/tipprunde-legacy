import { useParams, useRouteLoaderData } from 'react-router-dom';

export function useCurrentChampionship() {
  const { championships } = useRouteLoaderData('app');
  const { championshipId } = useParams();

  const currentChampionship =
    championshipId === undefined
      ? championships?.at(0) || null
      : championships?.find((c) => c.id === championshipId);

  if (currentChampionship === undefined) {
    throw new Response('Not Found', { status: 404 });
  }
  return currentChampionship;
}
