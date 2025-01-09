import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/db';
import { BaseModel } from '../model/base/model';
import { baseModelConverter } from './base-model-converter';

export const updateEntity = async <T extends BaseModel>(
  path: string,
  entity: T
): Promise<void> => {
  const { id, ...data } = entity;
  const docRef = doc(db, path, id).withConverter(baseModelConverter<T>());
  await setDoc(docRef, data);
};
