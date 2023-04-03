import { defineNitroConfig } from 'nitropack';

export default defineNitroConfig({
  routeRules: {
    '/api/v1/**': { cors: true, headers: { 'access-control-allow-methods': 'GET' } },
    '/api/v2/**': { cors: true, headers: { 'access-control-allow-methods': 'GET' } },
  },
});
