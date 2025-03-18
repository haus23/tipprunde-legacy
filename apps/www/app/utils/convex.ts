// convexApi1742336762624
// Copied: 18/03/2025

import { type FunctionReference, anyApi } from 'convex/server';

export const api: PublicApiType = anyApi as unknown as PublicApiType;
export const internal: InternalApiType = anyApi as unknown as InternalApiType;

export type PublicApiType = {
  messages: {
    list: FunctionReference<
      'query',
      'public',
      {
        apiKey: string;
        paginationOpts: {
          cursor: string | null;
          endCursor?: string | null;
          id?: number;
          maximumBytesRead?: number;
          maximumRowsRead?: number;
          numItems: number;
        };
      },
      any
    >;
    create: FunctionReference<
      'mutation',
      'public',
      { apiKey: string; body: string; user: string },
      any
    >;
  };
  auth: {
    isAuthenticated: FunctionReference<
      'query',
      'public',
      Record<string, never>,
      any
    >;
    signIn: FunctionReference<
      'action',
      'public',
      {
        calledBy?: string;
        params?: any;
        provider?: string;
        refreshToken?: string;
        verifier?: string;
      },
      any
    >;
    signOut: FunctionReference<'action', 'public', Record<string, never>, any>;
  };
  users: {
    current: FunctionReference<'query', 'public', Record<string, never>, any>;
  };
};
export type InternalApiType = {};
