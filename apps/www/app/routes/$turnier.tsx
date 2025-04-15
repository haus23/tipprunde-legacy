import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/$turnier')({
  loader: ({ context: { championships }, params: { turnier } }) => {
    const championship = championships.find((c) => c.id === turnier);
    return { championship };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
