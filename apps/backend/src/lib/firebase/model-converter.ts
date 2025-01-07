import type {
  DocumentData,
  FirestoreDataConverter,
  PartialWithFieldValue,
} from 'firebase-admin/firestore';

export const modelConverter = <
  T extends { id: string },
>(): FirestoreDataConverter<T> => ({
  toFirestore: (modelObject: PartialWithFieldValue<T>): DocumentData => {
    const { id, ...doc } = modelObject;
    return doc;
  },
  fromFirestore: (snapshot) =>
    ({
      id: snapshot.id,
      ...snapshot.data(),
    }) as T,
});
