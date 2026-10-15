import { championshipIdRegEx } from '@haus23/tipprunde-model';
import { createFileRoute, notFound, Outlet } from '@tanstack/react-router';
import { Suspense } from 'react';

import { AppShell } from '#/components/app/app-shell';
import { NotFoundComponent } from '#/components/app/error';
import { LoadingView } from '#/components/app/loading';

export const Route = createFileRoute('/$turnier')({
  beforeLoad: ({ context: { championships }, params: { turnier } }) => {
    // Not even shaped like a championship id: just an unknown page
    if (!championshipIdRegEx.test(turnier)) throw notFound();

    const championship = championships.find((c) => c.id === turnier);

    if (!championship)
      throw notFound({ data: 'Hoppla, dieses Turnier gibt es nicht.' });

    return { championship };
  },
  loader: ({ context: { championship } }) => ({ championship }),
  component: RouteComponent,
  notFoundComponent: NotFoundComponent,
});

function RouteComponent() {
  return (
    <AppShell>
      <Suspense fallback={<LoadingView />}>
        <Outlet />
      </Suspense>
    </AppShell>
  );
}
