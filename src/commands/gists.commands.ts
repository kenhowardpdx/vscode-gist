import { commands, window, workspace } from 'vscode';

import { getGist, getGists, updateGist } from '../gists';
import { logger } from '../logger';
import { extractTextDocumentDetails, filesSync, notify } from '../utils';

const _formatGistsForQuickPick = (gists: Gist[]): QuickPickGist[] =>
  gists.map((item, i, j) => ({
    block: item,
    description: `${item.public ? 'PUBLIC' : 'PRIVATE'} - Files: ${
      item.fileCount
    } - Created: ${item.createdAt} - Updated: ${item.updatedAt}`,
    label: `${j.length - i}. ${item.name}`
  }));

const _getGists = async (favorite = false): Promise<QuickPickGist[]> => {
  const items = await getGists(favorite);

  return _formatGistsForQuickPick(items || []);
};

const _getGist = async (id: string): Promise<Gist | void> => {
  const item = await getGist(id);

  if (item) {
    return item;
  }
};

const _openDocument = (file: string): Thenable<void> =>
  workspace
    .openTextDocument(file)
    .then(window.showTextDocument)
    .then(() => commands.executeCommand('workbench.action.keepEditor'));

const openCodeBlock = async (): Promise<void> => {
  let gistName = '';
  try {
    logger.info('User Activated "openCodeBlock"');

    const gists = await _getGists();

    if (gists.length === 0) {
      // TODO: alert user there are no gists
      return;
    }

    const selected = await window.showQuickPick(gists);
    if (!selected) {
      logger.info('User Aborted "openCodeBlock"');

      return;
    }
    gistName = `"${selected.block.name}"`;
    logger.info(`User Selected Gist: "${selected.label}"`);

    const codeBlock = await _getGist(selected.block.id);

    if (codeBlock) {
      logger.info('Code Block Found');
      const filePaths = filesSync(codeBlock.id, codeBlock.files);

      filePaths.forEach(_openDocument);
    }
  } catch (err) {
    const error: Error = err as Error;
    logger.error(`openCodeBlock > ${error && error.message}`);
    if (error && error.message === 'Not Found') {
      notify.error(
        `Could Not Open Gist ${gistName}`,
        `Reason: ${error.message}`
      );
    }
  }
};

const updateCodeBlock = async (doc: GistTextDocument): Promise<void> => {
  let file = '';
  try {
    const { id, filename, content } = extractTextDocumentDetails(doc);
    file = `"${filename}" `;
    if (id) {
      logger.info(`Saving "${filename}"`);
      await updateGist(id, filename, content);
      notify.info(`Saved "${filename}"`);
    } else {
      logger.info(`"${filename}" Not a Gist`);
    }
  } catch (err) {
    const error: Error = err as Error;
    logger.error(`updateCodeBlock > ${error && error.message}`);
    if (error && error.message === 'Not Found') {
      notify.error(`Could Not Save ${file}`, `Reason: ${error.message}`);
    }
  }
};

export { openCodeBlock, updateCodeBlock };
