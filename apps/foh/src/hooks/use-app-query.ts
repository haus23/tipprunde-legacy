import { QueryFunction, QueryKey, useQuery } from '@tanstack/react-query';

export function useAppQuery<
  TQueryFnData = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(queryKey: TQueryKey, queryFn: QueryFunction<TQueryFnData, TQueryKey>) {
  const result = useQuery(queryKey, queryFn);

  return { ...result, data: result.data as TData };
}
