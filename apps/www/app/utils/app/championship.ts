import { useLoaderData } from '@tanstack/react-router';

export function useChampionship() {
  const { championship } = useLoaderData({ from: '/$turnier' });
  return championship;
}
