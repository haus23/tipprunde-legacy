import { defineNitroConfig } from 'nitropack/config';

export default defineNitroConfig({
  routeRules: {
    '/api/v1/**': {
      // cache: { maxAge: 60 * 60, swr: true },
      cors: true,
      headers: { 'access-control-allow-methods': 'GET' },
    },
  },
});
