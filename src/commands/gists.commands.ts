import { window } from 'vscode';

import { getGists } from '../gists';
import { logger } from '../logger';

const _getGists = async (favorite = false): Promise<QuickPickGist[]> => {
  const items = (await getGists(favorite)).map((item, _, j) => ({
    block: item,
    description: `${item.public ? 'PUBLIC' : 'PRIVATE'} - Files: ${
      item.fileCount
    } - Created: ${item.createdAt} - Updated: ${item.updatedAt}`,
    label: `${j.length - 1}. ${item.name}`
  }));

  return items;
};

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
  } catch (err) {
    const error: Error = err as Error;
    logger.error(error && error.message);
  }
};

export { openCodeBlock };
