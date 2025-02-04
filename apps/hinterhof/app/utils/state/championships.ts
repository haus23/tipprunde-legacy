import type { Championship } from '@haus23/tipprunde-model';
import { atom, useAtom, useAtomValue } from 'jotai';
import { atomEffect } from 'jotai-effect';
import {
  collection,
  createEntity,
  orderByDesc,
  updateEntity,
} from '#/lib/firebase/repository';

const championshipsAtom = atom<Championship[]>([]);

const currentChampionshipInnerAtom = atom<Championship>();
const currentChampionshipAtom = atom(
  (get) => get(currentChampionshipInnerAtom) ?? get(championshipsAtom)[0],
  (get, set, championship: Championship | undefined) => {
    set(currentChampionshipInnerAtom, championship);
  },
);

const championshipsSubscriptionEffect = atomEffect((get, set) =>
  collection<Championship>('championships', orderByDesc('nr')).subscribe(
    (championships) => {
      console.log('Setting championships masterdata');
      set(championshipsAtom, championships);
    },
  ),
);

export function useChampionships() {
  useAtom(championshipsSubscriptionEffect);

  const createChampionship = (championship: Championship) =>
    createEntity<Championship>('championships', championship);
  const updateChampionship = (championship: Championship) =>
    updateEntity('championships', championship);

  const [currentChampionship, setCurrentChampionship] = useAtom(
    currentChampionshipAtom,
  );

  return {
    championships: useAtomValue(championshipsAtom),
    currentChampionship,
    setCurrentChampionship,
    createChampionship,
    updateChampionship,
  };
}
