import { FaceFrownIcon } from '@heroicons/react/24/outline';
import { isRouteErrorResponse, useLocation, useRouteError } from 'react-router';
import { Link } from '#/components/(ui)/atoms/link';

export function ErrorBoundary() {
  const { pathname } = useLocation();

  return (
    <div
      id="error"
      className="flex flex-col items-center justify-center gap-y-4 text-error"
    >
      <div className="flex justify-center text-error">
        <FaceFrownIcon className="h-40" />
      </div>
      <p className="mx-4 text-center text-3xl leading-snug [text-wrap:balance]">
        Hoppla, hier stimmt was nicht!
      </p>
      {pathname === '/' ? (
        <p className="mt-4 block text-2xl">Bitte Micha informieren!</p>
      ) : (
        <Link to="/" className="mt-4 block text-lg hover:underline">
          Zur Startseite
        </Link>
      )}
    </div>
  );
}

export function AppErrorBoundary() {
  const error = useRouteError();
  let errorMsg = 'Hoppla, hier stimmt was nicht.';

  if (isRouteErrorResponse(error)) {
    errorMsg = error.data;
  }

  return (
    <div
      id="error"
      className="flex flex-col items-center justify-center gap-y-4 text-error"
    >
      <div className="flex justify-center text-error-bg">
        <FaceFrownIcon className="h-40" />
      </div>
      <p className="mx-4 text-center text-3xl leading-snug [text-wrap:balance]">
        {errorMsg}
      </p>
      <Link to="/" className="mt-4 block text-lg hover:underline">
        Zur Startseite
      </Link>
    </div>
  );
}
