/**
 * Formats a date value
 *
 * @param dateStr Date value as string
 * @param options Determine short date format options
 * @returns Formatted date
 */
export function formatDate(
  dateStr: string,
  options?: { short?: boolean; shortIfCurrent?: boolean },
) {
  let { short, shortIfCurrent } = options || {
    short: false,
    shortIfCurrent: false,
  };

  if (!dateStr) return '';

  const date = new Date(dateStr);

  if (shortIfCurrent && new Date().getFullYear() === date.getFullYear()) {
    short = true;
  }

  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: short ? undefined : '2-digit',
  });
}
