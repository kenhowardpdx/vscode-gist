import { GistCommands } from '../extension-commands';

const updateAccessKey: CommandInitializer = (
  _config: Configuration,
  services: Services,
  utils: Utils
): [Command, CommandFn] => {
  const { gists, insights, logger, profiles } = services;

  const command = GistCommands.UpdateAccessKey;

  const commandFn = (): void => {
    try {
      const profile = profiles.get();
      let gistUrl: string;
      if (profile) {
        const key = profile.key;
        const url = (gistUrl = profile.url);
        gists.configure({ key, url });
      } else {
        gistUrl = 'reset';
        gists.configure({ key: undefined, url: undefined });
      }
      insights.track(command, { url: gistUrl });
      logger.debug('updated access key');
    } catch (err) {
      const error: Error = err as Error;
      logger.error(`${command} > ${error && error.message}`);
      insights.exception(command, { message: error.message });
      utils.notify.error('Could Not Update Access Key', error.message);
    }
  };

  return [command, commandFn];
};

export { updateAccessKey };
