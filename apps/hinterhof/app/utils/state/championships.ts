import type { Championship } from '@haus23/tipprunde-model';
import { atom, useAtom, useAtomValue } from 'jotai';
import { atomEffect } from 'jotai-effect';
import {
  collection,
  createEntity,
  orderByDesc,
  updateEntity,
} from '#/lib/firebase/repository';

export const championshipsAtom = atom<Championship[]>([]);
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
