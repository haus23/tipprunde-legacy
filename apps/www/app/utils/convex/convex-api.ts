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
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      any
    >;
    create: FunctionReference<
      'mutation',
      'public',
      { apiKey: string; body: string; user: string },
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      any
    >;
  };
  auth: {
    isAuthenticated: FunctionReference<
      'query',
      'public',
      Record<string, never>,
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      any
    >;
    signIn: FunctionReference<
      'action',
      'public',
      {
        calledBy?: string;
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        params?: any;
        provider?: string;
        refreshToken?: string;
        verifier?: string;
      },
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      any
    >;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    signOut: FunctionReference<'action', 'public', Record<string, never>, any>;
  };
  users: {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    current: FunctionReference<'query', 'public', Record<string, never>, any>;
  };
  flags: {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    getAll: FunctionReference<'query', 'public', { apiKey: string }, any>;
  };
};
// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type InternalApiType = {};
