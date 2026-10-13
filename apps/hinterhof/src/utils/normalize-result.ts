// Accepts the separators next to ":" on a German keyboard (with and without
// shift) and turns "2-1", "2,1", "2;1", "2.1", "2_1" or "2 : 1" into "2:1".
// Anything that is not two numbers with a separator stays as typed, so the
// validation can still report it.
const resultWithAnySeparator = /^(\d+)\s*[:,;.\-_]+\s*(\d+)$/;

export function normalizeResult(value: string) {
  return value.trim().replace(resultWithAnySeparator, '$1:$2');
}
