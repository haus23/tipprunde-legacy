// Shared focus and hover looks of the interactive UI components.

export const focusVisibleStyles =
  'rounded-sm outline-hidden focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-transparent';

export const componentHoverStyles =
  'text-muted-foreground hover:bg-highlight hover:text-foreground';

// Icon button that opens a popup; the pseudo element enlarges the touch
// target beyond the icon.
export const iconTriggerStyles =
  'relative inline-flex items-center justify-center p-1.5 text-muted-foreground after:absolute after:-inset-x-2 after:-inset-y-1 transition-[color,scale] hover:text-foreground data-popup-open:text-accent motion-safe:active:scale-[0.97]';
