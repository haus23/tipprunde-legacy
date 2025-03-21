import { tv } from 'tailwind-variants';

export const focusStyles = tv({
  base: [
    'rounded-sm outline-hidden',
    'data-focus-visible:ring-1 data-focus-visible:ring-accent-11 data-focus-visible:ring-offset-1 data-focus-visible:ring-offset-transparent',
  ],
});
