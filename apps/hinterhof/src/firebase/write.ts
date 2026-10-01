import { collection, doc, writeBatch } from 'firebase/firestore/lite';

import { db } from './db';
import { type BaseModel, modelConverter } from './model';

export type WriteOperation =
  | { type: 'set'; path: string; entity: BaseModel }
  | {
      type: 'merge';
      path: string;
      id: string;
      changes: Record<string, unknown>;
    };

type CommitListener = (operations: readonly WriteOperation[]) => void;

const listeners = new Set<CommitListener>();

/** Registriert die lokale Store-Synchronisierung nach erfolgreichen Writes. */
export function onCommit(listener: CommitListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Schreibt eine explizite fachliche Einheit atomar. Größere Einheiten werden
 * später bewusst aufgeteilt und erhalten eine eigene Fehlerbehandlung.
 */
export async function commitWrites(
  operations: readonly WriteOperation[],
): Promise<void> {
  if (operations.length === 0) return;
  if (operations.length > 500) {
    throw new Error('A Firestore batch cannot contain more than 500 writes');
  }

  const batch = writeBatch(db);
  for (const operation of operations) {
    const id = operation.type === 'set' ? operation.entity.id : operation.id;
    const reference = doc(db, operation.path, id).withConverter(
      modelConverter<BaseModel>(),
    );

    if (operation.type === 'set') {
      batch.set(reference, operation.entity);
    } else {
      batch.set(reference, operation.changes, { merge: true });
    }
  }

  await batch.commit();
  for (const listener of listeners) {
    try {
      listener(operations);
    } catch (error) {
      // Firestore was already committed. A local projection failure must not
      // turn a successful save into a misleading persistence error.
      console.error(error);
    }
  }
}

/** Legt eine Entity mit vorgegebener ID an. */
export async function createEntity<T extends BaseModel>(
  path: string,
  entity: T,
): Promise<void> {
  if (!entity.id) {
    throw new Error('Cannot create an entity without an explicit id');
  }
  await commitWrites([{ type: 'set', path, entity }]);
}

/** Legt eine Entity an; die ID wird clientseitig von Firestore erzeugt. */
export async function createEntityWithGeneratedId<T extends BaseModel>(
  path: string,
  entity: Omit<T, 'id'>,
): Promise<T> {
  const { id } = doc(collection(db, path));
  const createdEntity = { id, ...entity } as T;
  await commitWrites([{ type: 'set', path, entity: createdEntity }]);
  return createdEntity;
}

/** Ersetzt eine Entity vollständig. */
export async function updateEntity<T extends BaseModel>(
  path: string,
  entity: T,
): Promise<void> {
  await commitWrites([{ type: 'set', path, entity }]);
}

/** Übernimmt einzelne Felder in eine Entity. */
export async function patchEntity<T extends BaseModel>(
  path: string,
  entity: string | T,
  changes: Partial<T>,
): Promise<void> {
  const id = typeof entity === 'string' ? entity : entity.id;
  await commitWrites([{ type: 'merge', path, id, changes }]);
}
