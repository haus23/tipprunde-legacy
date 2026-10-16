// Two-state color scheme toggle that still follows the system: the page
// starts with the system scheme (see the script in index.html). A toggle
// switches to the opposite of what is shown; if that equals the system
// scheme, the stored choice is removed instead of pinned, so the page
// follows the system again. Only a toggle clears the choice, never a
// change of the system.
// https://lea.verou.me/blog/2026/dark-mode-toggles/#good-two-state-ux

const storageKey = 'colorScheme';

export function toggleColorScheme() {
  const root = document.documentElement;
  const dark = !root.classList.contains('dark');
  const systemDark = matchMedia('(prefers-color-scheme: dark)').matches;

  try {
    if (dark === systemDark) localStorage.removeItem(storageKey);
    else localStorage.setItem(storageKey, dark ? 'dark' : 'light');
  } catch {
    // Without storage the choice lasts until the next page load
  }
  switchWithoutTransitions(() => root.classList.toggle('dark', dark));
}

// All colors switch at once instead of fading one by one. Only the icons
// of the toggle keep their transition.
function switchWithoutTransitions(change: () => void) {
  const style = document.createElement('style');
  style.textContent =
    '*:not([data-theme-icon]) { transition: none !important; }';
  document.head.append(style);
  change();
  // Apply the new colors before transitions are allowed again
  void getComputedStyle(document.body).color;
  requestAnimationFrame(() => style.remove());
}
