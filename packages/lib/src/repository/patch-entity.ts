import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/db';
import { BaseModel } from '../model/base/model';
import { baseModelConverter } from './base-model-converter';

export const patchEntity = async <T extends BaseModel>(
  path: string,
  entity: T,
  updates: Partial<T>
): Promise<void> => {
  const docRef = doc(db, path, entity.id.toString()).withConverter(
    baseModelConverter<T>()
  );
  await setDoc(docRef, updates, { merge: true });
};
