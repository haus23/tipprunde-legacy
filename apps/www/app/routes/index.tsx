import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mx-2 sm:mx-0">
      <h1 className="font-medium text-xl">Startseite</h1>
    </div>
  );
}
