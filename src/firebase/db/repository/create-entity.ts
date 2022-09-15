import {
  doc,
  DocumentReference,
  runTransaction,
  setDoc,
} from 'firebase/firestore';

import { db } from '@/firebase/db';

import { BaseModel } from '../base-model';
import { converter } from '../converter';
import { SequenceModel } from '../sequence-model';

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
    entityRef = doc(db, path, entity.id).withConverter(converter<T>());
  } else {
    entityRef = doc(db, path).withConverter(converter<T>());
  }
  await setDoc(entityRef, entity);
};

/**
 * Creates an entity with generated sequencer id. An existing id prop will be overwritten.
 *
 * @param path
 * @param sequence
 * @param entity
 */
export const createWithSequence = async <T extends BaseModel>(
  path: string,
  sequence: string,
  entity: T
) => {
  const seqRef = doc(db, 'sequences', sequence).withConverter(
    converter<SequenceModel>()
  );
  let nextId = 1;

  return await runTransaction(db, async (tx) => {
    const seqDoc = await tx.get(seqRef);

    if (seqDoc.exists()) {
      nextId = seqDoc.data().sequence + 1;
      tx.update(seqRef, { sequence: nextId });
    } else {
      tx.set(seqRef, { id: sequence, sequence: nextId });
    }

    entity.id = nextId.toString();
    const entityRef = doc(db, path, entity.id).withConverter(converter<T>());
    tx.set(entityRef, entity);

    return entity;
  });
};
