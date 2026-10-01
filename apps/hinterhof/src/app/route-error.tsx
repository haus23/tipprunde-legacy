import { useRouteError } from 'react-router';

export default function RouteError() {
  const error = useRouteError();
  const message = error instanceof Error ? error.message : String(error);

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
