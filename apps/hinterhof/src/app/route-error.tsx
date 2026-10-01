import { useEffect } from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router';

function errorMessage(error: unknown): string {
  if (isRouteErrorResponse(error)) {
    const details = errorMessage(error.data);
    return `${error.status} ${error.statusText}${details ? `: ${details}` : ''}`;
  }

  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;

  if (error && typeof error === 'object') {
    const { code, message } = error as { code?: unknown; message?: unknown };
    if (typeof code === 'string' && typeof message === 'string') {
      return `${code}: ${message}`;
    }
    if (typeof message === 'string') return message;

    try {
      return JSON.stringify(error);
    } catch {
      return String(error);
    }
  }

  return String(error);
}

export default function RouteError() {
  const error = useRouteError();
  const message = errorMessage(error);

  useEffect(() => {
    console.error('Route error', error);
  }, [error]);

  return (
    <div role="alert" className="p-8">
      <h2 className="font-semibold text-xl">
        Daten konnten nicht geladen werden
      </h2>
      <p className="mt-2 text-gray-600">{message}</p>
      <button
        type="button"
        className="mt-4 rounded-md bg-indigo-600 px-3 py-2 text-sm text-white"
        onClick={() => window.location.reload()}
      >
        Neu laden
      </button>
    </div>
  );
}
