type Command = string;
type CommandFn = () => Promise<void> | void;

type CommandInitializer = (
  services: Services,
  utils: Utils
) => [Command, CommandFn];
