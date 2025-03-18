import { tv } from 'tailwind-variants';

export const focusRingStyles = tv({
  base: [
    'outline-hidden',
    'data-focus-visible:ring-2 data-focus-visible:ring-ring data-focus-visible:ring-offset-1 data-focus-visible:ring-offset-background',
  ],
});
