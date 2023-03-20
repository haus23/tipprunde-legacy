import { defineNitroConfig } from 'nitropack';

export default defineNitroConfig({
  storage: {
    cache: {
      driver: 'fs',
      base: process.env.STORAGE_BASE,
    },
  },
  devStorage: {
    cache: {
      driver: 'fs',
      base: process.env.STORAGE_BASE,
    },
  },
});
