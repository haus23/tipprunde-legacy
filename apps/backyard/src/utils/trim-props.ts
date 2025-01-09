export function trimProps<T>(object: Record<string, unknown>) {
  for (const [key, value] of Object.entries(object)) {
    if (typeof value === 'string') object[key] = value.trim();
  }
  return object as T;
}
