import { Championship, collection, filter, orderByDesc } from 'lib';
import { LoaderFunction } from 'react-router-dom';

import { queryClient } from '@/app';

export type AppData = {
  championships: Championship[];
};

export const appLoader: LoaderFunction = async (): Promise<AppData> => {
  const championships = await queryClient.fetchQuery(
    ['championships'],
    collection<Championship>(
      'championships',
      filter('published', '==', true),
      orderByDesc('nr')
    ).get
  );

  return { championships };
};
