import { type NotFoundRouteProps, isNotFound } from '@tanstack/react-router';
import { FrownIcon } from 'lucide-react';
import { Link } from '../ui/link';

export function NotFoundComponent({ data }: NotFoundRouteProps) {
  let errorMsg = 'Hoppla, hier stimmt was nicht.';

  if (isNotFound(data)) {
    errorMsg = data.data;
  }

  return (
    <div className="grid min-h-svh place-items-center text-error">
      <div className="flex flex-col items-center gap-y-4">
        <FrownIcon className="size-40" />
        <p className="mx-4 text-balance text-3xl text-gray-12 leading-snug">
          {errorMsg}
        </p>
        <Link to="/" className="block text-2xl text-gray-12">
          Zur Startseite
        </Link>
      </div>
    </div>
  );
}
