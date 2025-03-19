import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';

import { playersQuery } from '#/unterbau/queries';

export const Route = createFileRoute('/')({
  component: RankingComponent,
});

function RankingComponent() {
  const { championship } = useLoaderData({ from: '__root__' });
  const ranking = useSuspenseQuery(playersQuery(championship.id));

  return <h1 className="text-2xl">{championship.name} - Aktuelle Tabelle</h1>;
}
