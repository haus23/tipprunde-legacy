import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768;

/**
 * Hook watching my mobile breakpoint
 *
 * @returns true if screen width is mobile
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener('change', onChange, { passive: true });
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}

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
