import type {
  ErrorComponentProps,
  NotFoundRouteProps,
} from '@tanstack/react-router';
import { FrownIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from '../ui/link';
import { AppShell, useIsInAppShell } from './app-shell';

// Not found: an unknown page, or an unknown championship (the message
// comes as data with the thrown notFound). The router renders it inside
// or instead of the app shell, so it adds the shell when missing. Search
// engines skip it.
export function NotFoundComponent({ data }: NotFoundRouteProps) {
  const isInAppShell = useIsInAppShell();
  const message =
    typeof data === 'string' ? data : 'Hoppla, diese Seite gibt es nicht.';

  const content = (
    <div className="grid place-items-center py-12">
      <meta name="robots" content="noindex" />
      <div className="flex flex-col items-center gap-y-4">
        <FrownIcon className="size-40 text-error" aria-hidden="true" />
        <h1 className="mx-4 text-balance text-center text-3xl leading-snug">
          {message}
        </h1>
        <Link to="/" className="block text-2xl">
          Zur Startseite
        </Link>
      </div>
    </div>
  );

  return isInAppShell ? content : <AppShell>{content}</AppShell>;
}

// Loading errors (e.g. the backend is unreachable): retry by reloading.
export function ErrorComponent({ error }: ErrorComponentProps) {
  console.error(error);

  // Relative, so it lies above the gradient of the root route
  return (
    <div className="relative grid min-h-svh place-items-center">
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
