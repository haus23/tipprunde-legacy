import { Link } from 'react-router';
import { Card, CardContent } from '#/components/card';
import { focusRing } from '#/styles/focus';
import { cn } from '#/utils/cn';

// Unknown routes and championships, shown inside the app layout.
export default function NotFound({
  message = 'Diese Seite gibt es nicht.',
}: {
  message?: string;
}) {
  return (
    <Card className="mt-5">
      <CardContent className="space-y-4">
        <h2 className="font-semibold text-xl">Nicht gefunden</h2>
        <p className="text-muted-foreground">{message}</p>
        <Link
          to="/"
          className={cn(
            focusRing,
            'inline-flex h-9 items-center rounded-md border border-primary bg-primary px-4 font-medium text-primary-foreground text-sm shadow-xs hover:bg-primary/90',
          )}
        >
          Zum aktuellen Turnier
        </Link>
      </CardContent>
    </Card>
  );
}
