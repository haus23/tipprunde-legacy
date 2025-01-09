import { atomFamily } from 'recoil';
import { Championship, collection, Tip } from 'lib';

export const tipsState = atomFamily<Tip[], Championship['id'] | undefined>({
  key: 'tipsState',
  effects: (championshipId) => [
    ({ setSelf }) =>
      championshipId
        ? collection<Tip>(`championships/${championshipId}/tips`).subscribe(
            setSelf
          )
        : setSelf([]),
  ],
});
