import { CurrentTipsSchema } from '@haus23/tipprunde-model';

import { queryOptions } from '@tanstack/react-query';
import * as v from 'valibot';

async function fetchCurrentTips(championshipId: string) {
  console.log('Fetching current tips', championshipId);
  const response = await fetch(
    `${baseUrl}/championships/${championshipId}/current-tips`,
  );
  return v.parse(CurrentTipsSchema, await response.json());
}

export const currentTipsQuery = (championshipId: string) =>
  queryOptions({
    queryKey: ['current-tips', championshipId],
    queryFn: () => fetchCurrentTips(championshipId),
  });
