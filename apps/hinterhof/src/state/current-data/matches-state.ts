import { type Championship, type Match, collection, orderByAsc } from 'lib';
import { atomFamily } from 'recoil';

export const matchesState = atomFamily<Match[], Championship['id'] | undefined>(
  {
    key: 'matchesState',
    effects: (championshipId) => [
      ({ setSelf }) =>
        championshipId
          ? collection<Match>(
              `championships/${championshipId}/matches`,
              orderByAsc('nr'),
            ).subscribe(setSelf)
          : setSelf([]),
    ],
  },
);
