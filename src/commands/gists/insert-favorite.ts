import { window } from 'vscode';

import { GistCommands } from '../extension-commands';

import { insertText, selectFile } from './utils';

const insertFavorite: CommandInitializer = (
  _config: Configuration,
  services: Services,
  utils: Utils
): [Command, CommandFn] => {
  const { gists, logger } = services;

  const command = GistCommands.InsertFavorite;

  const commandFn = async (): Promise<void> => {
    try {
      const editor = window.activeTextEditor;
      if (!editor) {
        throw new Error('Open a file before inserting');
      }

      const list = await gists.getGists(true);
      const selected = await utils.input.quickPick(list);

      if (!selected) {
        services.logger.debug('No gist selected');

        return;
      }

      const gist = await gists.getGist(selected.block.id);
      // selected file to insert
      const file = await selectFile(gist);
      if (!file) {
        services.logger.debug('No file selected');

        return;
      }
      await insertText(editor, file.content);
    } catch (err) {
      const error: Error = err as Error;
      logger.error(`${command} > ${error && error.message}`);
      utils.notify.error('Could Not Insert', `Reason: ${error.message}`);
    }
  };

  return [command, commandFn];
};

export { insertFavorite };
