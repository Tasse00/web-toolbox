export function unique<T>(
  arr: T[],
  hash?: (v: T) => string,
): T[] {
  const getKey = hash || JSON.stringify;

  const hashes: string[] = [];

  function onlyUnique(value: T, index: number, self: T[]) {
    const v = getKey(value);
    if (hashes.includes(v)) {
      return false;
    } else {
      hashes.push(v);
      return true;
    }
  }

  return arr.filter(onlyUnique);
}
