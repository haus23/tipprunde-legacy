import { Championship, collection, filter, orderByDesc } from 'lib';
import { LoaderFunction } from 'react-router-dom';

import { queryClient } from '@/app';

export type AppData = {
  championships: Championship[];
  currentChampionship: Championship | null;
};

export const appLoader: LoaderFunction = async ({
  params: { championshipId },
}): Promise<AppData> => {
  const championships = await queryClient.fetchQuery(
    ['championships'],
    collection<Championship>(
      'championships',
      filter('published', '==', true),
      orderByDesc('nr')
    ).get
  );
  const currentChampionship =
    championshipId === 'turnier'
      ? championships?.at(0) || null
      : championships?.find((c) => c.id === championshipId);

  if (currentChampionship === undefined) {
    throw new Response('Not Found', { status: 404 });
  }

  return { championships, currentChampionship };
};
