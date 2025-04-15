import { createFileRoute, useLoaderData } from '@tanstack/react-router';

export const Route = createFileRoute('/$turnier/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { championship } = useLoaderData({ from: '/$turnier' });
  return <h2>{championship?.name}</h2>;
}
