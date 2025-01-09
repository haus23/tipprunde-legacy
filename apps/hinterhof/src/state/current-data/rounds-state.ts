import { type Championship, type Round, collection, orderByAsc } from 'lib';
import { atomFamily } from 'recoil';

export const roundsState = atomFamily<Round[], Championship['id'] | undefined>({
  key: 'roundsState',
  effects: (championshipId) => [
    ({ setSelf }) =>
      championshipId
        ? collection<Round>(
            `championships/${championshipId}/rounds`,
            orderByAsc('nr'),
          ).subscribe(setSelf)
        : setSelf([]),
  ],
});
