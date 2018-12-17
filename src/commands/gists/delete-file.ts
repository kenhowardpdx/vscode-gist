import { commands, window } from 'vscode';

import { GistCommands } from '../extension-commands';

const deleteFile: CommandInitializer = (
  services: Services,
  utils: Utils
): [Command, CommandFn] => {
  const { gists, insights, logger } = services;

  const command = GistCommands.DeleteFile;

  const commandFn = async (): Promise<void> => {
    try {
      const editor = window.activeTextEditor;
      const doc: undefined | GistTextDocument = editor && editor.document;
      if (!doc) {
        throw new Error('Document Missing');
      }
      const { id, filename } = utils.files.extractTextDocumentDetails(doc);
      if (id) {
        const canDelete =
          (await utils.input.prompt('Enter "DELETE" to confirm')) === 'DELETE';
        if (!canDelete) {
          logger.info('User Aborted Deletion');

          return;
        }
        logger.info(`Deleting File "${id}"`);
        // tslint:disable-next-line:no-null-keyword
        await gists.deleteFile(id, filename);
        commands.executeCommand('workbench.action.closeActiveEditor');
        utils.notify.info('Deleted File');
        insights.track(command);
      } else {
        logger.info(`"${doc.fileName}" Not a Gist`);
        utils.notify.info('Document Is Not a Gist');
      }
    } catch (err) {
      const error: Error = err as Error;
      logger.error(`${command} > ${error && error.message}`);
      insights.exception(command, { messsage: error.message });
      utils.notify.error('Could Not Delete File', `Reason: ${error.message}`);
    }
  };

  return [command, commandFn];
};

export { deleteFile };
