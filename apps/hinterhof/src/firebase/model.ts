import type {
  DocumentData,
  FirestoreDataConverter,
  PartialWithFieldValue,
} from 'firebase/firestore/lite';

export type BaseModel = {
  id: string;
};

/** Die Dokument-ID lebt im Modell als `id`, aber nicht als Feld im Dokument. */
export function modelConverter<
  T extends BaseModel,
>(): FirestoreDataConverter<T> {
  return {
    toFirestore(model: PartialWithFieldValue<T>): DocumentData {
      const { id: _, ...data } = model;
      return data;
    },
    fromFirestore(snapshot) {
      const data = { ...snapshot.data() };
      delete data.updated_at;
      return { id: snapshot.id, ...data } as T;
    },
  };
}
