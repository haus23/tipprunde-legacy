/**
 * Provide a condition and if that condition is falsy, throws an error
 * with the given message.
 *
 * @param condition The condition to check
 * @param message The optional message to throw
 *
 * @throws {Error} if condition is falsy
 */
export function invariant(
  condition: unknown,
  message?: string,
): asserts condition {
  if (!condition) {
    throw new Error(message || 'Unexpected falsy invariant assertion');
  }
}
