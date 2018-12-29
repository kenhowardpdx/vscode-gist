import { commands, Uri, window } from 'vscode';

import { GistCommands } from '../extension-commands';

const openInBrowser: CommandInitializer = (
  _config: Configuration,
  services: Services,
  utils: Utils
): [Command, CommandFn] => {
  const { gists, insights, logger } = services;

  const command = GistCommands.OpenInBrowser;

  const commandFn = async (): Promise<void> => {
    const gistName = '';
    try {
      logger.info(`User Activated ${command}`);

      const editor = window.activeTextEditor;

      if (!editor) {
        utils.notify.info('No open documents');

        return;
      }

      const gistId = utils.files.extractTextDocumentDetails(editor.document).id;

      const gist = await gists.getGist(gistId);

      commands.executeCommand('vscode.open', Uri.parse(gist.url));

      insights.track(command);
    } catch (err) {
      const error: Error = err as Error;
      logger.error(`${command} > ${error && error.message}`);
      insights.exception(command, { messsage: error.message });
      if (error && error.message === 'Not Found') {
        utils.notify.error(
          `Could Not Open Gist ${gistName}`,
          `Reason: ${error.message}`
        );
      } else {
        utils.notify.error('Unable To Open Gists', error.message);
      }
    }
  };

  return [command, commandFn];
};

export { openInBrowser };
