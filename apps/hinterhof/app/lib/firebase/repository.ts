import type {
  DocumentReference,
  QueryConstraint,
  WhereFilterOp,
} from 'firebase/firestore';
import {
  doc,
  collection as firestoreCollection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore';

import { db, modelConverter } from './db';

export function orderByDesc(field: string) {
  return orderBy(field, 'desc');
}
export function orderByAsc(field: string) {
  return orderBy(field, 'asc');
}
export function filter(field: string, op: WhereFilterOp, value: unknown) {
  return where(field, op, value);
}

export const collection = <T extends { id: string }>(
  path: string,
  ...constraints: QueryConstraint[]
) => {
  const q = query(firestoreCollection(db, path), ...constraints).withConverter(
    modelConverter<T>(),
  );

  return {
    get: async () => {
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => d.data());
    },
    subscribe: (subscriber: (entities: T[]) => void) => {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        subscriber(snapshot.docs.map((d) => d.data()));
      });
      return unsubscribe;
    },
  };
};

/**
 * Creates entity. If entity.id is falsy (empty), an id is created.
 *
 * @param path
 * @param entity
 */
export const createEntity = async <T extends { id: string }>(
  path: string,
  entity: T,
): Promise<void> => {
  let entityRef: DocumentReference<T>;

  if (entity.id) {
    entityRef = doc(db, path, entity.id).withConverter(modelConverter<T>());
  } else {
    entityRef = doc(firestoreCollection(db, path)).withConverter(
      modelConverter<T>(),
    );
  }
  await setDoc(entityRef, entity);
};

/**
 * Updates entity.
 *
 * @param path
 * @param entity
 */
export const updateEntity = async <T extends { id: string }>(
  path: string,
  entity: T,
): Promise<void> => {
  const { id, ...data } = entity;
  const docRef = doc(db, path, id).withConverter(modelConverter<T>());
  await setDoc(docRef, data);
};
