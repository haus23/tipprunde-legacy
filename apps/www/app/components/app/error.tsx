import {
  type ErrorComponentProps,
  isNotFound,
  type NotFoundRouteProps,
} from '@tanstack/react-router';
import { FrownIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from '../ui/link';

export function NotFoundComponent({ data }: NotFoundRouteProps) {
  let errorMsg = 'Hoppla, hier stimmt was nicht.';

  if (isNotFound(data)) {
    errorMsg = data.data;
  }

  return (
    <div className="grid min-h-svh place-items-center">
      <div className="flex flex-col items-center gap-y-4">
        <FrownIcon className="size-40 text-error" />
        <p className="mx-4 text-balance text-center text-3xl leading-snug">
          {errorMsg}
        </p>
        <Link to="/" className="block text-2xl">
          Zur Startseite
        </Link>
      </div>
    </div>
  );
}

// Loading errors (e.g. the backend is unreachable): retry by reloading.
export function ErrorComponent({ error }: ErrorComponentProps) {
  console.error(error);

  return (
    <div className="grid min-h-svh place-items-center">
      <div className="flex flex-col items-center gap-y-4">
        <FrownIcon className="size-40 text-error" aria-hidden="true" />
        <p className="mx-4 text-balance text-center text-3xl leading-snug">
          Hoppla, die Daten konnten nicht geladen werden.
        </p>
        <Button onClick={() => window.location.reload()} className="text-lg">
          Neu laden
        </Button>
      </div>
    </div>
  );
}
