import { type Championship, type Tip, collection } from 'lib';
import { atomFamily } from 'recoil';

export const tipsState = atomFamily<Tip[], Championship['id'] | undefined>({
  key: 'tipsState',
  effects: (championshipId) => [
    ({ setSelf }) =>
      championshipId
        ? collection<Tip>(`championships/${championshipId}/tips`).subscribe(
            setSelf,
          )
        : setSelf([]),
  ],
});
