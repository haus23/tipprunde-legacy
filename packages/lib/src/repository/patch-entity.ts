import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/db';
import type { BaseModel } from '../model/base/model';
import { baseModelConverter } from './base-model-converter';

export async function patchEntity<T extends BaseModel>(
  path: string,
  entityId: string,
  updates: Partial<T>,
): Promise<void>;
export async function patchEntity<T extends BaseModel>(
  path: string,
  entity: T,
  updates: Partial<T>,
): Promise<void>;

export async function patchEntity<T extends BaseModel>(
  path: string,
  entity: string | T,
  updates: Partial<T>,
): Promise<void> {
  const id = typeof entity === 'string' ? entity : entity.id;
  const docRef = doc(db, path, id).withConverter(baseModelConverter<T>());
  await setDoc(docRef, updates, { merge: true });
}
