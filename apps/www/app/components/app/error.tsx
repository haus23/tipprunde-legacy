import type {
  ErrorComponentProps,
  NotFoundRouteProps,
} from '@tanstack/react-router';
import { FrownIcon } from 'lucide-react';
import { cn } from '#/utils/cn';
import { focusVisibleStyles } from '../ui/_styles';
import { Link } from '../ui/link';
import { AppShell, BareShell, useIsInAppShell } from './app-shell';

// Icon, message and an action, at the top of the page content.
function ErrorView({
  message,
  children,
}: {
  message: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid place-items-center py-12">
      <div className="flex flex-col items-center gap-y-4">
        <FrownIcon className="size-40 text-error" aria-hidden="true" />
        <h1 className="mx-4 text-balance text-center text-3xl leading-[1.4]">
          {message}
        </h1>
        {children}
      </div>
    </div>
  );
}

// Not found: an unknown page, or an unknown championship (the message
// comes as data with the thrown notFound). The router renders it inside
// or instead of the app shell, so it adds the shell when missing. Search
// engines skip it.
export function NotFoundComponent({ data }: NotFoundRouteProps) {
  const isInAppShell = useIsInAppShell();
  const message =
    typeof data === 'string' ? data : 'Hoppla, diese Seite gibt es nicht.';

  const content = (
    <ErrorView message={message}>
      <meta name="robots" content="noindex" />
      <Link to="/" className="block text-2xl">
        Zur Startseite
      </Link>
    </ErrorView>
  );

  return isInAppShell ? content : <AppShell>{content}</AppShell>;
}

// Loading errors (e.g. the backend is unreachable). Reloading rarely
// helps, as the backend is usually down, so it is only a quiet offer next
// to the hint to tell Micha. A late error shows inside the app shell; an
// early one may lack the championships, so it gets the bare shell.
export function ErrorComponent({ error }: ErrorComponentProps) {
  console.error(error);
  const isInAppShell = useIsInAppShell();

  const content = (
    <ErrorView message="Hoppla, die Daten konnten nicht geladen werden.">
      <p className="mx-4 max-w-md text-balance text-center text-lg text-muted-foreground">
        Du kannst es mit{' '}
        <button
          type="button"
          onClick={() => window.location.reload()}
          className={cn(
            focusVisibleStyles,
            'text-foreground underline underline-offset-2 transition-colors hover:text-accent',
          )}
        >
          Neu laden
        </button>{' '}
        versuchen. Hilft das nicht, gib bitte Micha Bescheid.
      </p>
    </ErrorView>
  );

  return isInAppShell ? content : <BareShell>{content}</BareShell>;
}
