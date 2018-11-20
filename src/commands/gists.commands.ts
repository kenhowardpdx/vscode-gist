import { commands, window, workspace } from 'vscode';

import { getGist, getGists, updateGist } from '../gists';
import { insights } from '../insights';
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

const _openDocument = async (file: string): Promise<void> => {
  const doc = await workspace.openTextDocument(file);
  await window.showTextDocument(doc);
  commands.executeCommand('workbench.action.keepEditor');
};

const openCodeBlock = async (): Promise<void> => {
  let gistName = '';
  try {
    logger.info('User Activated "openCodeBlock"');

    const gists = await _getGists();

    const selected = await window.showQuickPick(gists);
    if (selected) {
      gistName = `"${selected.block.name}"`;
      logger.info(`User Selected Gist: "${selected.label}"`);

      const { id, files, fileCount } = await getGist(selected.block.id);
      const filePaths = filesSync(id, files);

      // await is not available not available in forEach
      for (const filePath of filePaths) {
        await _openDocument(filePath);
      }

      logger.info('Opened Gist');
      insights.track('open', undefined, { fileCount });
    }
  } catch (err) {
    const error: Error = err as Error;
    logger.error(`openCodeBlock > ${error && error.message}`);
    insights.exception('openCodeBlock', { messsage: error.message });
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
      insights.track('save');
    } else {
      logger.info(`"${doc.fileName}" Not a Gist`);
    }
  } catch (err) {
    const error: Error = err as Error;
    logger.error(`updateCodeBlock > ${error && error.message}`);
    insights.exception('updateCodeBlock', { messsage: error.message });
    if (error && error.message === 'Not Found') {
      notify.error(`Could Not Save ${file}`, `Reason: ${error.message}`);
    }
  }
};

export { openCodeBlock, updateCodeBlock };
