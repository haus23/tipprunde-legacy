import { useQuery } from 'convex/react';
import { api } from './convex-api';

const API_KEY = import.meta.env.VITE_CONVEX_API_KEY;

type FeatureFlag = 'chat';

export function useFeatureFlag(flag: FeatureFlag) {
  const flags = useQuery(api.flags.getAll, { apiKey: API_KEY });

  return flags?.find((f) => f.key === flag)?.value || false;
}
