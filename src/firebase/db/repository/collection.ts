import {
  QueryConstraint,
  collection as firestoreCollection,
  query,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '@/firebase/db';

import { BaseModel } from '../base-model';
import { baseModelConverter } from '../converter';

export const collection = <T extends BaseModel>(
  path: string,
  ...constraints: QueryConstraint[]
) => {
  const q = query(firestoreCollection(db, path), ...constraints).withConverter(
    baseModelConverter<T>()
  );

  return {
    subscribe: (subscriber: (entities: T[]) => void) => {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        subscriber(snapshot.docs.map((d) => d.data()));
      });
      return unsubscribe;
    },
  };
};
