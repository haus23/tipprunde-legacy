import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/spiele_')({
  component: MatchesComponent,
});

function MatchesComponent() {
  return <h1 className="text-2xl">Spiele</h1>;
}
