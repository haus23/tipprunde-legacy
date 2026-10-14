import { useEffect } from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router';
import Button from '#/components/button';
import { Card, CardContent } from '#/components/card';

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
    <div role="alert" className="mx-auto max-w-7xl px-4 py-9 sm:px-6 md:px-8">
      <Card>
        <CardContent className="space-y-4">
          <h2 className="font-semibold text-xl">
            Daten konnten nicht geladen werden
          </h2>
          <p className="text-muted-foreground">{message}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Neu laden
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
