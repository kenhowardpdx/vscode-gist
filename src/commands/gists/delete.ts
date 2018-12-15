import { commands, window } from 'vscode';

import { GistCommands } from '../extension-commands';

const deleteCommand: CommandInitializer = (
  services: Services,
  utils: Utils
): [Command, CommandFn] => {
  const { gists, insights, logger } = services;

  const command = GistCommands.Delete;

  const closeGistEditors = (gistId: string): void => {
    const editors = window.visibleTextEditors;

    editors.forEach((e) => {
      const { id } = utils.files.extractTextDocumentDetails(e.document);
      if (gistId === id) {
        window.showTextDocument(e.document);
        commands.executeCommand('workbench.action.closeActiveEditor');
      }
    });
  };

  const commandFn = async (): Promise<void> => {
    try {
      const editor = window.activeTextEditor;
      const doc: undefined | GistTextDocument = editor && editor.document;
      if (!doc) {
        utils.notify.error('Document Missing');
        insights.exception(command, { message: 'document missing' });

        return;
      }
      const { id } = utils.files.extractTextDocumentDetails(doc);
      if (id) {
        logger.info(`Deleting Gist "${id}"`);
        await gists.deleteGist(id);
        closeGistEditors(id);
        utils.notify.info('Deleted Gist');
        insights.track(command);
      } else {
        logger.info(`"${doc.fileName}" Not a Gist`);
        utils.notify.info('Document Is Not a Gist');
      }
    } catch (err) {
      const error: Error = err as Error;
      logger.error(`${command} > ${error && error.message}`);
      insights.exception(command, { messsage: error.message });
      utils.notify.error('Could Not Delete Gist', `Reason: ${error.message}`);
    }
  };

  return [command, commandFn];
};

export { deleteCommand };
