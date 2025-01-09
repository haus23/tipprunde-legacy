import { atomFamily } from 'recoil';
import { Championship, collection, Match, orderByAsc } from 'lib';

export const matchesState = atomFamily<Match[], Championship['id'] | undefined>(
  {
    key: 'matchesState',
    effects: (championshipId) => [
      ({ setSelf }) =>
        championshipId
          ? collection<Match>(
              `championships/${championshipId}/matches`,
              orderByAsc('nr')
            ).subscribe(setSelf)
          : setSelf([]),
    ],
  }
);
