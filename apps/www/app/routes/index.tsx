import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: RankingComponent,
});

function RankingComponent() {
  return <h1 className="text-2xl">Aktuelle Tabelle</h1>;
}
