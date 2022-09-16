import { db } from '@/firebase/db';
import { doc, FirestoreDataConverter, getDoc } from 'firebase/firestore';

export async function getEntity<T>(
  path: string,
  id: string,
  converter: () => FirestoreDataConverter<T>
) {
  const docRef = doc(db, path, id).withConverter(converter());
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    throw Error(`No such document: ${path}/${id}`);
  }
}
