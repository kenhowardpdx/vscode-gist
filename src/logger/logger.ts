// tslint:disable:no-console no-any
export enum Levels {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}
export class Logger {
  public static log = (
    method: 'debug' | 'log' | 'info' | 'warn' | 'error',
    ...args: any[]
  ): void => {
    const prefix = `vscode-gist>${method}:`;
    if (method !== 'debug') {
      console[method](prefix, ...args);
    } else {
      console.log(prefix, ...args);
    }
  }
  private level: Levels;

  public constructor(level: Levels) {
    this.level = level;
  }

  public debug(...args: any[]): void {
    if (this.level === Levels.DEBUG) {
      Logger.log('debug', ...args);
    }
  }

  public error(...args: any[]): void {
    if (this.level <= Levels.ERROR) {
      Logger.log('error', ...args);
    }
  }

  public info(...args: any[]): void {
    if (this.level <= Levels.INFO) {
      Logger.log('info', ...args);
    }
  }

  public warn(...args: any[]): void {
    if (this.level <= Levels.WARN) {
      Logger.log('warn', ...args);
    }
  }
}
