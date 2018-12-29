import { window } from 'vscode';

import { GistCommands } from '../extension-commands';

import { openGist } from './utils';

const create: CommandInitializer = (
  config: Configuration,
  services: Services,
  utils: Utils
): [Command, CommandFn] => {
  const { gists, insights, logger } = services;

  const command = GistCommands.Create;

  const commandFn = async (): Promise<void> => {
    let gistName = '';
    try {
      const editor = window.activeTextEditor;
      if (!editor) {
        throw new Error('Open a file before creating');
      }
      const selection = editor.selection;
      const content = editor.document.getText(
        selection.isEmpty ? undefined : selection
      );
      const details = utils.files.extractTextDocumentDetails(editor.document);
      const filename = (details && details.filename) || 'untitled.txt';
      const description = await utils.input.prompt('Enter description');
      const defaultValue = config.get<boolean>('defaultPrivate') ? 'N' : 'Y';
      const isPublic =
        (
          (await utils.input.prompt('Public? Y = Yes, N = No', defaultValue)) ||
          defaultValue
        )
          .slice(0, 1)
          .toLowerCase() === 'y';

      gistName = description || filename;

      const gist = await gists.createGist(
        { [filename]: { content } },
        description,
        isPublic
      );

      await openGist(gist, config.get<number>('maxFiles'));
    } catch (err) {
      const context = gistName ? ` ${gistName}` : '';
      const error: Error = err as Error;
      logger.error(`${command} > ${error && error.message}`);
      insights.exception(command, { messsage: error.message });
      utils.notify.error(
        `Could Not Create${context}`,
        `Reason: ${error.message}`
      );
    }
  };

  return [command, commandFn];
};

export { create };
