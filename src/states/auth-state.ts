import { atom } from 'recoil';
export const authState = atom<boolean>({
  key: 'authState',
  effects: [
    ({ setSelf }) => {
      setTimeout(() => {
        setSelf(true);
      }, 5000);
    },
  ],
});
