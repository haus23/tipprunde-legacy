import { atomFamily } from 'recoil';
import { Championship, collection, Round } from 'lib';

export const roundsState = atomFamily<Round[], Championship['id'] | undefined>({
  key: 'matcheState',
  effects: (championshipId) => [
    ({ setSelf }) =>
      championshipId
        ? collection<Round>(`championships/${championshipId}/rounds`).subscribe(
            setSelf
          )
        : setSelf([]),
  ],
});
