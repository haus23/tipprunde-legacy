import { twMerge } from 'tailwind-merge';

export const focusVisibleStyles = twMerge(
  'rounded-sm outline-hidden',
  'data-focus-visible:ring-1 data-focus-visible:ring-accent-11 data-focus-visible:ring-offset-1 data-focus-visible:ring-offset-transparent',
);

export const componentHoverStyles = twMerge(
  'text-gray-11 data-hovered:text-gray-12 data-hovered:bg-accent-4',
);
