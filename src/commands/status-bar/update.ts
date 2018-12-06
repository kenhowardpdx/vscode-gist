import { StatusBarAlignment, window } from 'vscode';

import { ProfileCommands, StatusBarCommands } from '../extension-commands';

const update: CommandInitializer = (
  services: Services,
  _utils: Utils
): [Command, CommandFn] => {
  const { insights, logger, profiles } = services;

  const statusBar = window.createStatusBarItem(StatusBarAlignment.Left);
  statusBar.show();

  const command = StatusBarCommands.Update;

  const commandFn = (): void => {
    try {
      const activeProfile = profiles.get();
      statusBar.text = `GIST ${
        activeProfile ? `[${activeProfile.name}]` : '[Create Profile]'
      }`;
      statusBar.command = activeProfile
        ? ProfileCommands.Select
        : ProfileCommands.Create;

      logger.debug('Status Bar Updated');
    } catch (err) {
      const error: Error = err as Error;
      logger.error(`${command} > ${error && error.message}`);
      insights.exception(command, { messsage: error.message });
    }
  };

  return [command, commandFn];
};

export { update };
