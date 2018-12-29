import { window } from 'vscode';

import { GistCommands } from '../extension-commands';

const add: CommandInitializer = (
  _config: Configuration,
  services: Services,
  utils: Utils
): [Command, CommandFn] => {
  const { gists, insights, logger } = services;

  const command = GistCommands.Add;

  const commandFn = async (): Promise<void> => {
    try {
      const editor = window.activeTextEditor;
      if (!editor) {
        throw new Error('Open a file before adding');
      }
      const selection = editor.selection;
      const content = editor.document.getText(
        selection.isEmpty ? undefined : selection
      );
      const tmpFilename = utils.files.getFileName(editor.document);
      const filename =
        (await utils.input.prompt('Enter filename', tmpFilename)) ||
        tmpFilename;

      const list = await gists.getGists();
      const selected = await utils.input.quickPick(list);

      if (!selected) {
        services.logger.debug('No gist selected');

        return;
      }

      await services.gists.updateGist(selected.block.id, filename, content);

      utils.notify.info(`Added "${filename}" to "${selected.block.name}" Gist`);
      services.insights.track(command);
    } catch (err) {
      const error: Error = err as Error;
      logger.error(`${command} > ${error && error.message}`);
      insights.exception(command, { messsage: error.message });
      utils.notify.error('Could Not Add File', `Reason: ${error.message}`);
    }
  };

  return [command, commandFn];
};

export { add };
