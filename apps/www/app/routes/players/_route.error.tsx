import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Link, isRouteErrorResponse, useRouteError } from 'react-router';
import { useChampionship } from '#/utils/app/championship';

export function PlayersErrorBoundary() {
  const championship = useChampionship();
  const error = useRouteError();
  let errorMsg = 'Hoppla, hier stimmt was nicht.';

  if (isRouteErrorResponse(error)) {
    errorMsg = error.data;
  }

  return (
    <div
      id="error"
      className="flex flex-col justify-center items-center gap-y-4 text-destructive-foreground"
    >
      <div className="flex justify-center text-destructive">
        <ExclamationTriangleIcon className="h-40" />
      </div>
      <p className="mx-4 text-center text-3xl leading-snug [text-wrap:balance]">
        {errorMsg}
      </p>
      <Link
        to={`/${championship.id}`}
        className="mt-4 block text-2xl hover:underline"
      >
        Tabelle der {championship.name}
      </Link>
      <Link
        to={`/${championship.id}/spieler`}
        className="mt-4 block text-2xl hover:underline"
      >
        Spielerübersicht der {championship.name}
      </Link>
    </div>
  );
}
