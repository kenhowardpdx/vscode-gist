import { commands, env, window } from 'vscode';

import { GistCommands } from '../extension-commands';

const createConfirmation: CommandInitializer = (
  _config: Configuration,
  services: Services,
  utils: Utils
): [Command, CommandFn] => {
  const { insights, logger } = services;

  const command = GistCommands.CreateConfirmation;

  enum CommandActions {
    OpenInBrowser = 'Open in Browser',
    CopyGistURL = 'Copy Gist URL to Clipboard'
  }

  const commandFn = async (gist: Gist): Promise<void> => {
    try {
      const { url } = gist;
      logger.info(`Now presenting ${gist.description}`);

      const selection = await window.showInformationMessage(
        'Gist Created',
        { title: CommandActions.OpenInBrowser },
        { title: CommandActions.CopyGistURL }
      );

      if (!selection) {
        logger.info('User dismissed "Gist Created" dialog without action');

        return;
      }

      if (selection.title === CommandActions.OpenInBrowser) {
        commands.executeCommand(GistCommands.OpenInBrowser, gist);
        logger.info('Opening Gist in Browser');
        insights.track(command, { type: 'browser' });
      } else if (selection.title === CommandActions.CopyGistURL) {
        env.clipboard.writeText(url);
        logger.info('Copying Gist URL to Clipboard');
        insights.track(command, { type: 'clipboard' });
      }
    } catch (err) {
      const error: Error = err as Error;
      logger.error(`${command} > ${error && error.message}`);
      insights.exception(command, { messsage: error.message });
      utils.notify.error(error.message);
    }
  };

  return [command, commandFn];
};

export { createConfirmation };
