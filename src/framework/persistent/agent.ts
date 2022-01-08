type CB = () => any;
type KeyPath = string;
// type NodeStatus = {
//   affectedBy: KeyPath[];
//   updating: boolean;
// };

export interface RemoteService {
  update: (key: KeyPath, value: any) => Promise<void>;
  load: () => Promise<any>;
}

// 记录当前更新中的key
// 每次update都要检子树是否在更新中。


export class PersistentAgent {
  private document: any;

  // 树中节点状态: 下级更新中, 更新中
  private cbs: Record<KeyPath, CB[]> = {};

  private updating: KeyPath[] = [];
  // private keypaths: KeyPath[] = [];
  private loading: boolean = true;

  constructor(private readonly svc: RemoteService) {
    this.loading = true;
    console.log("Loading");
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
        Object.keys(this.cbs).map(key => this.runCb(key));
      });
  }

  // private syncDocument() {
  //   // TODO 去除无用节点
  //   this.keypaths = parseKeyPaths(this.document);
  // }

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

  // 父级不在更新中，子级不在更新中
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

  // 更新key, 返回值表示是否开始
  update<T>(key: string, value: T): boolean {
    if (this.loading) return false;
    const parents: KeyPath[] = [];
    const children: KeyPath[] = [];
    if (!this.canUpdate(key)) {
      return false;
    }
    // for (let kp of this.keypaths) {
    //   if (kp !== key) {
    //     if (kp.startsWith(key)) {
    //       children.push(kp);
    //     } else if (key.startsWith(kp)) {
    //       parents.push(kp);
    //     }
    //   }
    // }
    // if (this.states[key] === undefined) {
    //   this.states[key] = { affectedBy: [], updating: false };
    // }

    // const state = this.states[key];
    // if (state.updating || state.affectedBy.length > 0) {
    //   return false; // is updating or children is updating
    // }
    this.updating.push(key);
    // 更新节点状态
    for (const pk of Object.keys(this.cbs)) {
      if (this.willBeAffectBy(pk, key)) {
        this.runCb(pk)
      }
    }
    // this.states[key].updating = true;
    // for (let parent of parents) {
    //   if (this.states[parent] === undefined) {
    //     this.states[parent] = { affectedBy: [], updating: false };
    //   }
    //   const state = this.states[parent];
    //   state.affectedBy.push(key);
    //   if (state.affectedBy.length === 1) {
    //     this.runCb(parent, "updating");
    //   }
    // }
    // for (let child of children) {
    //   if (this.states[child] === undefined) {
    //     this.states[child] = { affectedBy: [], updating: false };
    //   }
    //   this.states[child].updating = true;
    //   this.runCb(child, "updating");
    // }
    // this.runCb(key, "updating");

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
        const idx = this.updating.indexOf(key)
        if (idx > -1) {
          this.updating.splice(idx, 1);
        }
        // 更新节点状态
        for (const pk of Object.keys(this.cbs)) {
          if (this.willBeAffectBy(pk, key)) {
            this.runCb(pk)
          }
        }
      });
    return true;
  }

  private runCb(key: KeyPath) {
    (this.cbs[key] || []).forEach((cb, idx) => {
      console.log(`run cb for ${key}: ${idx + 1}`);
      cb();
    });
  }

  private set(key: KeyPath, value: any) {
    if (key === "") {
      this.document = value;
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
          target[kp] = {}
        }
        target = target[kp];
      }
      target[field] = value;
    }
  }
}
