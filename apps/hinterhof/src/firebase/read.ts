import { collection, getDocs } from 'firebase/firestore/lite';

import { db } from './db';
import { type BaseModel, modelConverter } from './model';

/** Liest alle Dokumente einer Collection. Sortiert wird im State-Layer. */
export async function getEntities<T extends BaseModel>(
  path: string,
): Promise<T[]> {
  const reference = collection(db, path).withConverter(modelConverter<T>());
  const snapshot = await getDocs(reference);
  return snapshot.docs.map((document) => document.data());
}
