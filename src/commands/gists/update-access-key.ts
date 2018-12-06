import { GistCommands } from '../extension-commands';

const updateAccessKey: CommandInitializer = (
  services: Services,
  _utils: Utils
): [Command, CommandFn] => {
  const { gists, insights, logger, profiles } = services;

  const command = GistCommands.UpdateAccessKey;

  const commandFn = (): void => {
    const { key, url } = profiles.get();
    gists.configure({ key, url });
    insights.track(command, { url });
    logger.debug('updated access key');
  };

  return [command, commandFn];
};

export { updateAccessKey };
