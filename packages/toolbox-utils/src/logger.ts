export interface CreateLoggerOptions {
  name: string;
  level: string;
  enabled: boolean;
}

// export interface Logger {
//   log: (...args: any) => void;
//   debug: (...args: any) => void;
//   info: (...args: any) => void;
//   level: (...args: any) => void;
// }

function empty() {}

export interface LevelConfig {
  func: (...args: any[]) => void;
  base: Object;
  value: number;
}
export interface IGlobalLoggerConfig {
  enabled: boolean;
  level: string;
  levels: {
    [name: string]: LevelConfig;
  };
}

export const GlobalLoggerConfig: IGlobalLoggerConfig = {
  enabled: true,
  level: "LOG",
  levels: {
    ALL: {
      func: console.debug,
      base: window.console,
      value: 0,
    },
    DBG: {
      func: console.debug,
      base: window.console,
      value: 5,
    },
    LOG: {
      func: console.log,
      base: window.console,
      value: 10,
    },
    INF: {
      func: console.info,
      base: window.console,
      value: 20,
    },
    WRN: {
      func: console.warn,
      base: window.console,
      value: 30,
    },
    ERR: {
      func: console.error,
      base: window.console,
      value: 40,
    },
  },
};
export class Logger {
  enabled: boolean;
  name: string;
  level: string;

  constructor({
    name = "MAIN",
    level = "ALL",
    enabled = true,
  }: Partial<CreateLoggerOptions> = {}) {
    this.enabled = enabled;
    this.name = name;
    this.level = level;
  }

  private getLevelConfig(level: string): LevelConfig {
    let levelValue = GlobalLoggerConfig.levels[level];
    if (levelValue === undefined) {
      console.error(`unknown level '${level}',reset to 'log' level value`);
      levelValue = GlobalLoggerConfig.levels["LOG"];
    }
    return levelValue;
  }

  private buildFunc(targetLevel: string): (...args: any[]) => void {
    if (GlobalLoggerConfig.enabled && this.enabled) {
      let {
        value: targetLevelValue,
        base,
        func,
      } = this.getLevelConfig(targetLevel);
      let enableLevelValue = this.getLevelConfig(this.level).value;
      let globalLevelValue = this.getLevelConfig(
        GlobalLoggerConfig.level
      ).value;
      if (
        targetLevelValue >= enableLevelValue &&
        targetLevelValue >= globalLevelValue
      ) {
        return func.bind(base, this.formatPrefix(targetLevel));
      }
    }
    return empty;
  }

  private formatPrefix(level: string): string {
    const d = new Date();
    const hour = `${d.getHours() + 1}`.padStart(2, "0");
    const min = `${d.getMinutes() + 1}`.padStart(2, "0");
    const sec = `${d.getSeconds() + 1}`.padStart(2, "0");
    const mil = `${d.getMilliseconds() + 1}`.padStart(3, "0");

    return `${hour}:${min}:${sec}.${mil} ${level} ${this.name}`;
  }

  get debug(): (...args: any) => void {
    return this.buildFunc("DBG");
  }
  get log(): (...args: any) => void {
    return this.buildFunc("LOG");
  }
  get info(): (...args: any) => void {
    return this.buildFunc("INF");
  }
  get warn(): (...args: any) => void {
    return this.buildFunc("WRN");
  }
  get error(): (...args: any) => void {
    return this.buildFunc("ERR");
  }
}
