import { collection, orderByDesc } from '@/lib/firebase/repository';
import { championshipsAtom } from '@/utils/state/championships';
import { currentChampionshipAtom } from '@/utils/state/current-championship/championship';
import { store } from '@/utils/store';
import type { Championship } from '@haus23/tipprunde-model';
import type { LoaderFunction } from 'react-router';

export const loader: LoaderFunction = async ({ params }) => {
  console.log('Loading championships.');

  const championships = await collection<Championship>(
    'championships',
    orderByDesc('nr'),
  ).get();

  store.set(championshipsAtom, championships);
  store.set(
    currentChampionshipAtom,
    championships.find((c) => c.id === params.championshipId) ||
      championships.at(0),
  );

  return null;
};
