import { Outlet, createFileRoute, notFound } from '@tanstack/react-router';
import { NotFoundComponent } from '#/components/app/error';

export const Route = createFileRoute('/$turnier')({
  loader: ({ context: { championships }, params: { turnier } }) => {
    const championship = championships.find((c) => c.id === turnier);

    if (!championship)
      throw notFound({ data: 'Hoppla, so etwas gibt es bei uns nicht!' });

    return { championship };
  },
  component: RouteComponent,
  notFoundComponent: NotFoundComponent,
});

function RouteComponent() {
  return <Outlet />;
}
