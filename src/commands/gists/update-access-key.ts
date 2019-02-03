import { GistCommands } from '../extension-commands';

const updateAccessKey: CommandInitializer = (
  config: Configuration,
  services: Services,
  utils: Utils
): [Command, CommandFn] => {
  const { gists, insights, logger, profiles } = services;

  const command = GistCommands.UpdateAccessKey;

  const commandFn = (): void => {
    try {
      const profile = profiles.get();
      let gistUrl = 'unknown';
      let overridesApplied = 'false';
      if (profile) {
        let optionOverride: GistServiceOptions = {};
        const profileOptionOverride = config.get<{
          [profile: string]: GistServiceOptions;
        }>('profileOptions');

        if (
          profileOptionOverride &&
          Object.keys(profileOptionOverride).length > 0 &&
          profileOptionOverride[profile.name]
        ) {
          overridesApplied = 'true';
          optionOverride = { ...profileOptionOverride[profile.name] };
        }
        const key = optionOverride.key || profile.key;
        const url = optionOverride.url || (gistUrl = profile.url);
        const rejectUnauthorized = optionOverride.rejectUnauthorized || true;
        gists.configure({ key, url, rejectUnauthorized });
      } else {
        gistUrl = 'reset';
        gists.configure({
          key: undefined,
          rejectUnauthorized: undefined,
          url: undefined
        });
      }
      insights.track(command, { url: gistUrl, overridesApplied });
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
