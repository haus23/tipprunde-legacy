import { atomFamily } from 'recoil';
import { Championship, collection, orderByAsc, Round } from 'lib';

export const roundsState = atomFamily<Round[], Championship['id'] | undefined>({
  key: 'roundsState',
  effects: (championshipId) => [
    ({ setSelf }) =>
      championshipId
        ? collection<Round>(
            `championships/${championshipId}/rounds`,
            orderByAsc('nr')
          ).subscribe(setSelf)
        : setSelf([]),
  ],
});
