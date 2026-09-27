import type {
  DocumentData,
  FirestoreDataConverter,
  PartialWithFieldValue,
} from 'firebase/firestore';

export type BaseModel = {
  id: string;
};

export const baseModelConverter = <
  T extends BaseModel,
>(): FirestoreDataConverter<T> => ({
  toFirestore: (modelObject: PartialWithFieldValue<T>): DocumentData => {
    const { id, ...doc } = modelObject;
    return doc;
  },
  fromFirestore: (snapshot) => {
    const data = { ...snapshot.data() };
    delete data.updated_at;

    return {
      id: snapshot.id,
      ...data,
    } as T;
  },
});
