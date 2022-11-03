import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/db';
import { BaseModel } from '../model/base/model';

export async function deleteEntity(
  path: string,
  entityId: string
): Promise<void>;
export async function deleteEntity<T extends BaseModel>(
  path: string,
  entity: T
): Promise<void>;
export async function deleteEntity<T extends BaseModel>(
  path: string,
  entity: string | T
): Promise<void> {
  const id = typeof entity === 'string' ? entity : entity.id;
  const docRef = doc(db, path, id);
  await deleteDoc(docRef);
}
