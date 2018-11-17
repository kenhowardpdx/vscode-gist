import { commands, window, workspace } from 'vscode';

import { getGist, getGists } from '../gists';
import { logger } from '../logger';
import { filesSync } from '../utils';

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
    logger.info(`User Selected Gist: "${selected.label}"`);

    const codeBlock = await _getGist(selected.block.id);

    if (codeBlock) {
      logger.info('Code Block Found');
      const filePaths = filesSync(codeBlock.id, codeBlock.files);

      filePaths.forEach(_openDocument);
    }
  } catch (err) {
    const error: Error = err as Error;
    logger.error(error && error.message);
  }
};

export { openCodeBlock };
