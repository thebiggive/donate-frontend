/**
 * Call this from any line that should be unreachable, or in other words where the
 * param is typed as never. Will error both compile time if the param has an inhabited type,
 * and at runtime if the function is actually called.
 */
export function assertUnreachable(x: never): never {
  throw new Error(`Unreachable code hit with value: ${JSON.stringify(x)}`);
}
