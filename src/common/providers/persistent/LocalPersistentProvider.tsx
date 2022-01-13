import { useMemo } from "react";
import { PersistentAgent, RemoteService } from "./agent";
import { PersistentContext } from "./context";

export class BrowserStorage implements RemoteService {
  constructor(
    private readonly keyName: string,
    private readonly mockDelay: number
  ) {}
  private loadLocal() {
    return JSON.parse(window.localStorage.getItem(this.keyName) || "{}");
  }
  private saveLocal(value: any) {
    window.localStorage.setItem(this.keyName, JSON.stringify(value));
  }
  private async runMockDelay() {
    await new Promise((res) => setTimeout(res, this.mockDelay));
  }
  async load() {
    await this.runMockDelay();
    return this.loadLocal();
  }
  async update(key: string, value: any) {
    await this.runMockDelay();
    if (key === "") {
      this.saveLocal(value);
    } else {
      const root = this.loadLocal();
      let target = root;
      const parts = key.split(".");
      const parents = parts.slice(0, parts.length - 1);
      const field = parts[parts.length - 1];
      for (let kp of parents) {
        if (target[kp] === undefined) {
          target[kp] = {};
        }
        target = target[kp];
      }
      target[field] = value;
      this.saveLocal(root);
    }
  }
}

export const LocalPersistentProvider: React.FC<{
  keyName?: string;
  mockDelay?: number;
}> = ({ keyName = "__persistent", mockDelay = 0, children }) => {
  const agent = useMemo(
    () => new PersistentAgent(new BrowserStorage(keyName, mockDelay)),
    [keyName, mockDelay]
  );
  return (
    <PersistentContext.Provider value={agent}>
      {children}
    </PersistentContext.Provider>
  );
};
