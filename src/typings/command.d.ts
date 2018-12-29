type Command = string;
type CommandFn = () => Promise<void> | void;

type CommandInitializer = (
  _config: Configuration,
  services: Services,
  utils: Utils
) => [Command, CommandFn];
