import { doc, setDoc } from 'firebase/firestore';

import { db } from '@/firebase/db';
import { BaseModel } from '../base-model';
import { converter } from '../converter';

export const update = async <T extends BaseModel>(path: string, entity: T) => {
  const { id, ...data } = entity;
  const docRef = doc(db, path, id).withConverter(converter<T>());
  await setDoc(docRef, data);

  return entity;
};
