/**
 * Eine Live-Datenquelle (z. B. mehrere Firestore-Listener), die über `ensure(key)`
 * ein stabiles Promise liefert. Das Promise erfüllt sich, sobald die Quelle
 * meldet, dass alle Daten einmal da sind – passend für React 19 `use()`.
 *
 * - Gleicher Key  → dasselbe Promise (keine Doppel-Subscriptions, StrictMode-sicher)
 * - Neuer Key     → alte Listener stoppen, neue starten
 * - Fehler        → Cache verwerfen, damit ein späterer Versuch neu startet
 */
type Start<K> = (
  key: K,
  ready: () => void,
  fail: (error: unknown) => void,
) => () => void;

type Entry<K> = { key: K; promise: Promise<void>; stop: () => void };

export function liveSource<K>(
  start: Start<K>,
  onLateError: (error: unknown) => void = console.error,
) {
  let current: Entry<K> | undefined;

  function stop() {
    current?.stop();
    current = undefined;
  }

  function ensure(key: K): Promise<void> {
    if (current && Object.is(current.key, key)) return current.promise;
    stop();

    let settled = false;
    let stopListening: () => void = () => undefined;

    const promise = new Promise<void>((resolve, reject) => {
      stopListening = start(
        key,
        () => {
          settled = true;
          resolve();
        },
        (error) => {
          if (current === entry) stop();
          if (settled) return onLateError(error);
          settled = true;
          reject(error);
        },
      );
    });

    const entry: Entry<K> = { key, promise, stop: stopListening };
    current = entry;
    return promise;
  }

  return { ensure, stop };
}

/**
 * Erzeugt Setter für einzelne Store-Felder. Sobald jedes der `keys` mindestens
 * einmal gesetzt wurde, wird `ready` aufgerufen.
 */
export function syncFields<S extends object>(
  store: { setState(partial: Partial<S>): void },
  keys: readonly (keyof S)[],
  ready: () => void,
) {
  const pending = new Set(keys);
  return <F extends keyof S>(field: F) =>
    (value: S[F]) => {
      store.setState({ [field]: value } as unknown as Partial<S>);
      pending.delete(field);
      if (pending.size === 0) ready();
    };
}
