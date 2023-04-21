import { defineNitroConfig } from 'nitropack';

export default defineNitroConfig({
  routeRules: {
    '/api/v1/**': { swr: 60 * 60, cors: true, headers: { 'access-control-allow-methods': 'GET' } },
    '/api/v2/**': { swr: 60 * 60, cors: true, headers: { 'access-control-allow-methods': 'GET' } },
  },
});
