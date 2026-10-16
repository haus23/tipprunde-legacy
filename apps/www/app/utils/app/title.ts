import { useLayoutEffect } from 'react';

// Document title: the page, then the context, then the site.
export function pageTitle(...parts: string[]) {
  return [...parts, 'runde.tips'].join(' · ');
}

// The static title in index.html serves link previews and the time until
// React renders a title of its own. Components rendering one call this, so
// only a single title element remains.
export function useDropStaticTitle() {
  useLayoutEffect(() => {
    document.getElementById('static-title')?.remove();
  }, []);
}
