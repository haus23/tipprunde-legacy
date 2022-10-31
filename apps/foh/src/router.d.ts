import { Params } from 'react-router-dom';
import { AppData } from '@/app.loader';

declare module 'react-router-dom' {
  function useRouteLoaderData(routeId: 'app'): AppData;

  function useMatches(): {
    id: string;
    pathname: string;
    params: Params<string>;
    data: unknown;
    handle?: { childPath?: string };
  }[];
}
