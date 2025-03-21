import { twMerge } from 'tailwind-merge';

export const focusStyles = twMerge(
  'rounded-sm outline-hidden',
  'data-focus-visible:ring-1 data-focus-visible:ring-accent-11 data-focus-visible:ring-offset-1 data-focus-visible:ring-offset-transparent',
);
