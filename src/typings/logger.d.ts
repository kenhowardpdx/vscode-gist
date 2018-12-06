class Logger {
  public debug(...args: any[]): void;

  public error(...args: any[]): void;

  public info(...args: any[]): void;

  public setLevel(level: Levels): void;

  public warn(...args: any[]): void;
}
