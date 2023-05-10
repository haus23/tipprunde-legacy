import { defineNitroConfig } from 'nitropack/config';

export default defineNitroConfig({
  routeRules: {
    '/api/v1/**': { cors: true, headers: { 'access-control-allow-methods': 'GET' } },
  },
});
