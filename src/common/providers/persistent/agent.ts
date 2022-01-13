type CB = () => any;
type KeyPath = string;

export interface RemoteService {
  update: (key: KeyPath, value: any) => Promise<void>;
  load: () => Promise<any>;
}

export class PersistentAgent {
  private document: any;

  private cbs: Record<KeyPath, CB[]> = {};

  private updating: KeyPath[] = [];

  private loading: boolean = true;

  constructor(private readonly svc: RemoteService) {
    this.loading = true;
    this.svc
      .load()
      .then((res) => {
        this.document = res;
        this.loading = false;
      })
      .catch((reason) => {
        this.loading = false;
        console.error(reason);
      })
      .finally(() => {
        Object.keys(this.cbs).map((key) => this.runCb(key));
      });
  }

  on(key: string, cb: CB) {
    if (this.cbs[key] === undefined) {
      this.cbs[key] = [];
    }
    const keyCbs = this.cbs[key];
    if (!keyCbs.includes(cb)) {
      keyCbs.push(cb);
    }
  }

  off(key: string, cb: CB) {
    if (this.cbs[key]) {
      const idx = this.cbs[key].findIndex((c) => c === cb);
      if (idx > -1) {
        this.cbs[key].splice(idx, 1);
      }
    }
  }

  /**
   * 1. root value
   *   ''
   * 2. object key
   *   'field'
   * 3. array element
   *   '0'
   * 4. embbed
   *   'field.0'
   */
  get<T>(key: string): { value: T | undefined; loading: boolean } {
    let value = undefined;
    if (!this.loading) {
      if (key === "") {
        value = this.document;
      } else {
        const depth = key.split(".");
        let target = this.document;
        for (let dep of depth) {
          if (target === undefined) break;
          target = target[dep];
        }
        value = target;
      }
    }
    let loading = false;
    if (this.loading) {
      loading = true;
    } else {
      for (const updatingKp of this.updating) {
        if (this.willBeAffectBy(key, updatingKp)) {
          loading = true;
          break;
        }
      }
    }

    return { value, loading };
  }

  private canUpdate(key: KeyPath): boolean {
    for (const updatingKp of this.updating) {
      if (updatingKp.startsWith(key)) {
        return false;
      } else if (key.startsWith(updatingKp)) {
        return false;
      }
    }
    return true;
  }
  private willBeAffectBy(key: KeyPath, updatingKey: KeyPath): boolean {
    if (key.startsWith(updatingKey)) {
      return true;
    } else if (updatingKey.startsWith(key)) {
      return true;
    } else {
      return false;
    }
  }

  update<T>(key: string, value: T | undefined): boolean {
    if (this.loading) return false;
    if (!this.canUpdate(key)) {
      return false;
    }

    this.updating.push(key);

    for (const pk of Object.keys(this.cbs)) {
      if (this.willBeAffectBy(pk, key)) {
        this.runCb(pk);
      }
    }

    this.svc
      .update(key, value)
      .then(() => {
        // 设置value
        this.set(key, value);
      })
      .catch((reason) => {
        console.error(reason);
      })
      .finally(() => {
        const idx = this.updating.indexOf(key);
        if (idx > -1) {
          this.updating.splice(idx, 1);
        }
        // 更新节点状态
        for (const pk of Object.keys(this.cbs)) {
          if (this.willBeAffectBy(pk, key)) {
            this.runCb(pk);
          }
        }
      });
    return true;
  }

  private runCb(key: KeyPath) {
    (this.cbs[key] || []).forEach((cb, idx) => {
      cb();
    });
  }

  private set<T>(key: KeyPath, value: T | undefined) {
    if (key === "") {
      this.document = value || {};
    } else {
      let target = this.document;
      const parts = key.split(".");
      if (target === undefined && parts.length > 0) {
        this.document = {};
        target = this.document;
      }
      const parents = parts.slice(0, parts.length - 1);
      const field = parts[parts.length - 1];

      for (let kp of parents) {
        if (target[kp] === undefined) {
          target[kp] = {};
        }
        target = target[kp];
      }
      if (value === undefined) {
        delete target[field];
      } else {
        target[field] = value;
      }
    }
  }

  isLoading(key: string): boolean {
    return !this.canUpdate(key);
  }
}
