import { commands, Uri, window } from 'vscode';

import { GistCommands } from '../extension-commands';

const openInBrowser: CommandInitializer = (
  _config: Configuration,
  services: Services,
  utils: Utils
): [Command, CommandFn] => {
  const { gists, logger } = services;

  const command = GistCommands.OpenInBrowser;

  const commandFn = async (gist?: Gist): Promise<void> => {
    const getGistUrlFromOpenEditor = (): Promise<string> => {
      const editor = window.activeTextEditor;

      if (!editor) {
        throw new Error('No Open Editor');
      }

      const gistId = utils.files.extractTextDocumentDetails(editor.document).id;

      return gists.getGist(gistId).then((g: Gist) => g.url);
    };

    const gistName = '';
    try {
      const url = (gist && gist.url) || (await getGistUrlFromOpenEditor());
      commands.executeCommand('vscode.open', Uri.parse(url));
    } catch (err) {
      const error: Error = err as Error;
      logger.error(`${command} > ${error && error.message}`);
      if (error && error.message === 'Not Found') {
        utils.notify.error(
          `Could Not Open Gist ${gistName}`,
          `Reason: ${error.message}`
        );
      } else {
        utils.notify.error('Unable To Open Gist', error.message);
      }
    }
  };

  return [command, commandFn];
};

export { openInBrowser };
