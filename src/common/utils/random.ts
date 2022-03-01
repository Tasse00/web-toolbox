export const RANDOM_STRING_CANDIDATES =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890";

export function randomString(
  len: number,
  candidate: string = RANDOM_STRING_CANDIDATES
): string {
  const chars = [];
  for (let i = 0; i < len; i++) {
    chars.push(candidate[Math.floor(Math.random() * candidate.length)]);
  }
  return chars.join("");
}
