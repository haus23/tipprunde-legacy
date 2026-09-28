import toast from 'react-hot-toast';
import { CacheInvalidationError } from './invalidate-cache';

export function notify<T>(
  promise: Promise<T>,
  successMsg: string,
  loadingMsg = 'Speichern ...',
) {
  return toast
    .promise(promise, {
      loading: loadingMsg,
      success: successMsg,
      error: (error) =>
        error instanceof CacheInvalidationError
          ? 'Änderung gespeichert, aber die Cache-Aktualisierung ist fehlgeschlagen.'
          : 'Hoppla, das hat nicht geklappt.',
    })
    .catch((error: unknown) => {
      if (!(error instanceof CacheInvalidationError)) throw error;
    });
}
