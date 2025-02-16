import type { QueryConstraint } from 'firebase/firestore';
import {
  collection as firestoreCollection,
  getDocs,
  onSnapshot,
  query,
} from 'firebase/firestore';

import { db } from '../firebase/db';
import type { BaseModel } from '../model/base/model';
import { baseModelConverter } from './base-model-converter';

export const collection = <T extends BaseModel>(
  path: string,
  ...constraints: QueryConstraint[]
) => {
  const q = query(firestoreCollection(db, path), ...constraints).withConverter(
    baseModelConverter<T>(),
  );

  return {
    get: async () => {
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => d.data());
    },
    subscribe: (subscriber: (entities: T[]) => void) => {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        subscriber(snapshot.docs.map((d) => d.data()));
      });
      return unsubscribe;
    },
  };
};
