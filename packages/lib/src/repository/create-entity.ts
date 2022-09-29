import { doc, DocumentReference, setDoc } from 'firebase/firestore';
import { db } from '../firebase/db';
import { BaseModel } from '../model/base/model';
import { baseModelConverter } from './base-model-converter';

/**
 * Creates entity. If entity.id is falsy (empty), an id is created.
 *
 * @param path
 * @param entity
 */
export const createEntity = async <T extends BaseModel>(
  path: string,
  entity: T
): Promise<void> => {
  let entityRef: DocumentReference<T>;

  if (entity.id) {
    entityRef = doc(db, path, entity.id).withConverter(baseModelConverter<T>());
  } else {
    entityRef = doc(db, path).withConverter(baseModelConverter<T>());
  }
  await setDoc(entityRef, entity);
};
