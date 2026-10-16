// Document title: the page, then the context, then the site.
export function pageTitle(...parts: string[]) {
  return [...parts, 'runde.tips'].join(' · ');
}
