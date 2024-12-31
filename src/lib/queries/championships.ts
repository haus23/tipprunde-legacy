import { cachedFunction } from '../cached';

export const getChampionships = cachedFunction(
  () => {
    console.log('Fetching championships');
    return ['hr2324'];
  },
  { name: 'championships', getKey: () => 'list' },
);
