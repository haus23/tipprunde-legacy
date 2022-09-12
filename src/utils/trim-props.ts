export function trimProps<T>(object: { [key: string]: any }): T {
  for (const [key, value] of Object.entries(object)) {
    if (typeof value === 'string') object[key] = value.trim();
  }
  return object as T;
}
