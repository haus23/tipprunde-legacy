import { db } from '@/firebase/db';
import { doc, getDoc } from 'firebase/firestore';
import { BaseModel } from '../base-model';
import { baseModelConverter } from '../base-model-converter';

export async function getEntity<T extends BaseModel>(path: string, id: string) {
  const docRef = doc(db, path, id).withConverter(baseModelConverter());
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as T;
  } else {
    throw Error(`No such document: ${path}/${id}`);
  }
}
