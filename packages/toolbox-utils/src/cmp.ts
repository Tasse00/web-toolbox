export function isTheSamePlainObject(
  o1: Record<string, any>,
  o2: Record<string, any>
): boolean {
  const o1Keys = Object.keys(o1);
  if (o1Keys.length !== Object.keys(o2).length) {
    return false;
  }
  for (const key of o1Keys) {
    if (o1[key] !== o2[key]) {
      return false;
    }
  }
  return true;
}
