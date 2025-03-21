import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';

import { playersQuery } from '#/unterbau/queries';

export const Route = createFileRoute('/(home)/')({
  component: RankingComponent,
});

function RankingComponent() {
  const { championship } = useLoaderData({ from: '__root__' });
  const ranking = useSuspenseQuery(playersQuery(championship.id));

  return (
    <div>
      <h1 className="mx-2 text-2xl sm:mx-0">
        <span className="hidden md:inline">{championship.name} - </span>
        <span>
          {championship.completed ? 'Abschlusstabelle' : 'Aktuelle Tabelle'}
        </span>
      </h1>
    </div>
  );
}
