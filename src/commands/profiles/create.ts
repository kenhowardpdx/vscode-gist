import { commands, MessageItem, window } from 'vscode';

import {
  GistCommands,
  ProfileCommands,
  StatusBarCommands
} from '../extension-commands';

const create: CommandInitializer = (
  _config: Configuration,
  services: Services,
  utils: Utils
): [Command, CommandFn] => {
  const { insights, logger, profiles } = services;

  const command = ProfileCommands.Create;

  const commandFn = async (): Promise<void> => {
    try {
      const { title } = (await window.showInformationMessage(
        'Which GitHub Platform?',
        { modal: true },
        { title: 'GitHub.com (common)', isCloseAffordance: true },
        { title: 'GitHub Enterprise' }
      )) as MessageItem;

      const url =
        title === 'GitHub Enterprise'
          ? await utils.input.prompt('Enter your enterprise API url')
          : 'https://api.github.com';

      if (!url) {
        logger.debug('User Aborted Create Profile at "url"');

        return;
      }

      const key = await utils.input.prompt('Enter your access token');

      if (!key) {
        logger.debug('User Aborted Create Profile at "key"');

        return;
      }

      const name = await utils.input.prompt('Give this profile a name');

      if (!name) {
        logger.debug('User Aborted Create Profile at "name"');

        return;
      }

      profiles.add(name, key, url, true);
      await commands.executeCommand(StatusBarCommands.Update);
      await commands.executeCommand(GistCommands.UpdateAccessKey);
      insights.track(command);

      logger.debug('Profile Created');
    } catch (err) {
      const error: Error = err as Error;
      logger.error(`${command} > ${error && error.message}`);
      insights.exception(command, { messsage: error.message });
      utils.notify.error(
        'Could Not Create Profile',
        `Reason: ${error.message}`
      );
    }
  };

  return [command, commandFn];
};

export { create };
