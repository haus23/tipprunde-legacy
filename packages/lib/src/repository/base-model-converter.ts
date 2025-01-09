import {
  DocumentData,
  FirestoreDataConverter,
  PartialWithFieldValue,
} from 'firebase/firestore';

import { BaseModel } from '../model/base/model';

export const baseModelConverter = <
  T extends BaseModel
>(): FirestoreDataConverter<T> => ({
  toFirestore: (modelObject: PartialWithFieldValue<T>): DocumentData => {
    const { id, ...doc } = modelObject;
    return doc;
  },
  fromFirestore: (snapshot) =>
    ({
      id: snapshot.id,
      ...snapshot.data(),
    } as T),
});
