import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../../packages/ui-legacy/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '380px',
      },
    },
  },
} satisfies Config;
