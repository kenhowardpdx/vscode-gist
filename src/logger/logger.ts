import { OutputChannel } from 'vscode';

import { LOGGER_LEVEL } from '../constants';

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
      : // tslint:disable-next-line:semicolon
        new Logger(LOGGER_LEVEL));

  private static instance?: Logger;
  private level: Levels;
  private output?: OutputChannel;

  private constructor(level: Levels) {
    this.level = level;
  }

  public debug(...args: string[]): void {
    if (this.level === Levels.DEBUG) {
      this.log('debug', ...args);
    }
  }

  public error(...args: string[]): void {
    if (this.level <= Levels.ERROR) {
      this.log('error', ...args);
    }
  }

  public info(...args: string[]): void {
    if (this.level <= Levels.INFO) {
      this.log('info', ...args);
    }
  }

  public setLevel(level: Levels): void {
    this.level = level;
  }

  public setOutput(output: OutputChannel): void {
    this.output = output;
  }

  public warn(...args: string[]): void {
    if (this.level <= Levels.WARN) {
      this.log('warn', ...args);
    }
  }
  private log(
    method: 'debug' | 'log' | 'info' | 'warn' | 'error',
    ...args: string[]
  ): void {
    const prefix = `vscode-gist>${method}:`;
    const message = [...args].join(' > ');
    if (this.output) {
      this.output.appendLine(`${prefix} ${message}`);
    }
  }
}

export const logger = Logger.getInstance();
