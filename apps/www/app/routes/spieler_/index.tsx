import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/spieler_/')({
  component: PlayersComponent,
});

function PlayersComponent() {
  return <h1 className="text-2xl">Spieler</h1>;
}
