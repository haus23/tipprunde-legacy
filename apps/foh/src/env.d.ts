/// <reference types="vite/client" />

import { Params } from 'react-router-dom';

declare module 'react-router-dom' {
  function useMatches(): {
    id: string;
    pathname: string;
    params: Params<string>;
    data: unknown;
    handle?: { childPath?: string };
  }[];
}
