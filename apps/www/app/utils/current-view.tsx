import { useMatches } from 'react-router';

type RouteHandle = {
  viewPath: string;
};

function hasViewPath(handle: unknown): handle is RouteHandle {
  return typeof handle === 'object' && handle !== null && 'viewPath' in handle;
}

export function useCurrentView() {
  const matches = useMatches();

  const handle = matches.at(-1)?.handle;

  if (hasViewPath(handle)) {
    return handle.viewPath;
  }

  return '';
}
