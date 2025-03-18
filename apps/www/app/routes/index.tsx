import { createFileRoute, useLoaderData } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: RankingComponent,
});

function RankingComponent() {
  const { championship } = useLoaderData({ from: '__root__' });

  return <h1 className="text-2xl">{championship.name} - Aktuelle Tabelle</h1>;
}
