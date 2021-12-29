export const StoreKeys = {
  Urls: '__urls',
  PrivateKeys: '__private_keys',
};

export class Storage {
  get<T>(key: string, defaultValue: T): T {
    const json = localStorage.getItem(key);
    if (json === null) return defaultValue;
    try {
      return JSON.parse(json);
    } catch {
      return defaultValue;
    }
  }

  set<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getUrls(): string[] {
    return this.get(StoreKeys.Urls, []);
  }
  setUrls(value: string[]) {
    return this.set(StoreKeys.Urls, value);
  }

  getPrivateKeys(): string[] {
    return this.get(StoreKeys.PrivateKeys, []);
  }
  setPrivateKeys(value: string[]) {
    return this.set(StoreKeys.PrivateKeys, value);
  }
}


export default new Storage();