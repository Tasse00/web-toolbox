export function isValidWsUrl(url: string): boolean {
  return /^(wss?:\/\/)([0-9]{1,3}(?:\.[0-9]{1,3}){3}|[a-zA-Z]+):([0-9]{1,5})/.test(
    url
  );
}
