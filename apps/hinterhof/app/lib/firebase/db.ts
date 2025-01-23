import type {
  DocumentData,
  FirestoreDataConverter,
  PartialWithFieldValue,
} from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

import { app } from './app';

export const db = getFirestore(app);

export const modelConverter = <
  T extends { id: string },
>(): FirestoreDataConverter<T> => ({
  toFirestore: (modelObject: PartialWithFieldValue<T>) => {
    const { id, ...doc } = modelObject;
    return doc satisfies DocumentData;
  },
  fromFirestore: (snapshot) =>
    ({
      id: snapshot.id,
      ...snapshot.data(),
    }) as T,
});
