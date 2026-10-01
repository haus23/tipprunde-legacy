/**
 * Lädt Daten pro Key genau einmal und liefert dafür ein stabiles Promise für
 * React 19 `use()`. Verspätete Antworten alter Keys werden verworfen.
 */
export function loadSource<K, D>(
  load: (key: K) => Promise<D>,
  apply: (data: D, key: K) => void,
) {
  let current: { key: K; promise: Promise<void> } | undefined;

  function ensure(key: K): Promise<void> {
    if (current && Object.is(current.key, key)) return current.promise;

    const entry: { key: K; promise: Promise<void> } = {
      key,
      promise: Promise.resolve(),
    };
    entry.promise = load(key).then(
      (data) => {
        if (current === entry) apply(data, key);
      },
      (error: unknown) => {
        if (current === entry) current = undefined;
        throw error;
      },
    );
    current = entry;
    return entry.promise;
  }

  function reset() {
    current = undefined;
  }

  function reload(key: K) {
    reset();
    return ensure(key);
  }

  return { ensure, reload, reset };
}
