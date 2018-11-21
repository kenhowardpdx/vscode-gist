import { commands, window, workspace } from 'vscode';

import { configure, getGist, getGists, updateGist } from '../gists';
import { insights } from '../insights';
import { logger } from '../logger';
import { profiles } from '../profiles';
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
    } else {
      notify.error('Unable To Open Gists', error.message);
    }
  }
};

const updateCodeBlock = async (doc: GistTextDocument): Promise<void> => {
  let file = '';
  try {
    const editor = window.activeTextEditor;
    const { id, filename, content, language } = extractTextDocumentDetails(
      doc,
      editor
    );
    file = `"${filename}" `;
    if (id) {
      logger.info(`Saving "${filename}"`);
      await updateGist(id, filename, content);
      notify.info(`Saved "${filename}"`);
      insights.track('save', { language });
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

const updateGistAccessKey = (): void => {
  const { key, url } = profiles.get();
  configure({ key, url });
  insights.track('updateGistAccessKey', { url });
};

export { updateGistAccessKey, openCodeBlock, updateCodeBlock };
