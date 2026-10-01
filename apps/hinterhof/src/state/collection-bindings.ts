import type { BaseModel } from '#/firebase/model';
import { getEntities } from '#/firebase/read';
import type { WriteOperation } from '#/firebase/write';

type Binding<E> = {
  path: string;
  compare?: (a: E, b: E) => number;
  map?: (entity: BaseModel) => E;
};

/** Gemeinsame Beschreibung für Collection-Reads und lokales Write-through. */
export type Bindings<S> = {
  [F in keyof S]: S[F] extends (infer E extends BaseModel)[]
    ? Binding<E>
    : never;
};

type StoreLike<S> = {
  getState(): S;
  setState(partial: Partial<S>): void;
};

function mapEntity<E extends BaseModel>(
  binding: Binding<E>,
  entity: BaseModel,
): E {
  return binding.map ? binding.map(entity) : (entity as E);
}

/** Lädt alle gebundenen Collections parallel und sortiert sie lokal. */
export async function loadCollections<S extends object>(
  bindings: Bindings<S>,
): Promise<S> {
  const fields = Object.keys(bindings) as (keyof S & string)[];
  const lists = await Promise.all(
    fields.map(async (field) => {
      const binding = bindings[field] as Binding<BaseModel>;
      const entities = (await getEntities(binding.path)).map((entity) =>
        mapEntity(binding, entity),
      );
      return binding.compare ? entities.sort(binding.compare) : entities;
    }),
  );
  return Object.fromEntries(
    fields.map((field, index) => [field, lists[index]]),
  ) as S;
}

/**
 * Übernimmt erfolgreiche Writes in einem Store-Update. `false` bedeutet, dass
 * ein Merge sein Ausgangsmodell nicht gefunden hat und neu geladen werden muss.
 */
export function applyWrites<S extends object>(
  store: StoreLike<S>,
  bindings: Bindings<S>,
  operations: readonly WriteOperation[],
): boolean {
  const state = store.getState();
  const changes: Partial<S> = {};

  for (const field of Object.keys(bindings) as (keyof S & string)[]) {
    const binding = bindings[field] as Binding<BaseModel>;
    const relevant = operations.filter(
      (operation) => operation.path === binding.path,
    );
    if (relevant.length === 0) continue;

    const current = state[field] as BaseModel[];
    const byId = new Map(current.map((entity) => [entity.id, entity]));
    for (const operation of relevant) {
      if (operation.type === 'set') {
        byId.set(operation.entity.id, mapEntity(binding, operation.entity));
        continue;
      }

      const existing = byId.get(operation.id);
      if (!existing) return false;
      byId.set(
        operation.id,
        mapEntity(binding, {
          ...existing,
          ...operation.changes,
          id: operation.id,
        }),
      );
    }

    const entities = [...byId.values()];
    changes[field] = (
      binding.compare ? entities.sort(binding.compare) : entities
    ) as S[typeof field];
  }

  if (Object.keys(changes).length > 0) store.setState(changes);
  return true;
}
