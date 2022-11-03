import { BaseModel, collection } from 'lib';
import { useAppQuery } from './use-app-query';

export function useCollectionHash<T extends BaseModel>(
  path: string
): Record<string, T> {
  const { data } = useAppQuery([path], collection<T>(path).get);

  const dataHash = data.reduce(
    (hash, entity) => ({ ...hash, [entity.id]: entity }),
    {} as Record<string, T>
  );

  return dataHash;
}
