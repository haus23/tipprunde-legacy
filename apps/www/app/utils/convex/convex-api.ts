import { type FunctionReference, anyApi } from 'convex/server';

export const api: PublicApiType = anyApi as unknown as PublicApiType;

type FeatureFlag = {
  _id: string;
  key: string;
  value: string;
};

export type PublicApiType = {
  flags: {
    getAll: FunctionReference<
      'query',
      'public',
      { apiKey: string },
      FeatureFlag[] | undefined
    >;
  };
};
