import { tv } from 'tailwind-variants';

export const focusStyles = tv({
  base: [
    'rounded-sm outline-hidden',
    'focus-visible:ring-1 focus-visible:ring-accent-11 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent',
  ],
});
