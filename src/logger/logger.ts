import { LOGGER_LEVEL } from '../constants';

// tslint:disable:no-console no-any
export enum Levels {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}
class Logger {
  public static getInstance = (): Logger =>
    (Logger.instance = Logger.instance
      ? Logger.instance
      : new Logger(LOGGER_LEVEL))

  private static instance?: Logger;
  private static log = (
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

  private constructor(level: Levels) {
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

  public setLevel(level: Levels): void {
    this.level = level;
  }

  public warn(...args: any[]): void {
    if (this.level <= Levels.WARN) {
      Logger.log('warn', ...args);
    }
  }
}

export const logger = Logger.getInstance();
