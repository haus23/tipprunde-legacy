import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';

import { playersQuery } from '#/utils/queries';
import { RankingView } from './-views/ranking';

export const Route = createFileRoute('/')({
  component: RankingComponent,
});

function RankingComponent() {
  const { championship } = useLoaderData({ from: '__root__' });
  const ranking = useSuspenseQuery(playersQuery(championship.id));

  return <RankingView championship={championship} ranking={ranking.data} />;
}
