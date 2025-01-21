import headlessUI from '@headlessui/tailwindcss';
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
  plugins: [headlessUI],
} satisfies Config;
