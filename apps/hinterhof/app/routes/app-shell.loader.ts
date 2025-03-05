import type { Championship } from '@haus23/tipprunde-model';
import type { LoaderFunctionArgs } from 'react-router';

import { collection, orderByDesc } from '@/lib/firebase/repository';
import { championshipsAtom } from '@/utils/state/championships';
import { currentOptionalChampionshipAtom } from '@/utils/state/current-championship/championship';
import { store } from '@/utils/store';

export async function loader({ params }: LoaderFunctionArgs) {
  console.log('Loading championships.');

  const championships = await collection<Championship>(
    'championships',
    orderByDesc('nr'),
  ).get();

  const currentChampionship =
    championships.find((c) => c.id === params.championshipId) ||
    championships.at(0);

  store.set(championshipsAtom, championships);
  store.set(currentOptionalChampionshipAtom, currentChampionship);

  return null;
}
