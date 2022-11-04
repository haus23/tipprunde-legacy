export function formatDate(dateStr: string, short?: boolean) {
  const isShort = !!short;

  if (!dateStr) return '';

  const date = new Date(dateStr);

  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: isShort ? undefined : 'numeric',
  });
}
