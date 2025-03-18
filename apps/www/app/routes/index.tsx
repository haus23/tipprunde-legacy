import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomeRoute,
});

function HomeRoute() {
  return <h1 className="text-2xl">Aktuelle Tabelle</h1>;
}
