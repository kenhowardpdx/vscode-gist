type Command = string;
type CommandFn = (...args: any[]) => Promise<void> | void;

type CommandInitializer = (
  _config: Configuration,
  services: Services,
  utils: Utils
) => [Command, CommandFn];
