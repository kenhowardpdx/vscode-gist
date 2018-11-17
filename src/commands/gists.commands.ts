import * as fs from 'fs';
import * as path from 'path';
import * as tmp from 'tmp';
import { commands, window, workspace } from 'vscode';

import { list } from '../gists/index';
import { logger } from '../logger';
// import { logger } from './logger';

const selectGist = async (
  favorite = false
): Promise<QuickPickGist | undefined> => {
  const items = (await list(favorite)).map((item, i, j) => ({
    block: item,
    description: `${item.public ? 'PUBLIC' : 'PRIVATE'} - Files: ${
      item.fileCount
    } - Created: ${item.createdAt} - Updated: ${item.updatedAt}`,
    label: `${j.length - 1}. ${item.name}`
  }));

  return window.showQuickPick(items);
};

const openCodeBlock = async (): Promise<void> => {
  try {
    const selected = await selectGist();
    if (!selected) {
      return;
    }
    const dir = generateDirectory({ token: selected.block.id });
    // TODO: Open the files
  } catch (err) {
    logger.error(err);
  }
};

const generateDirectory = (options: {
  prefix?: string;
  token: string;
}): string => {
  const prefix = `${options.prefix ? options.prefix : 'vscode_gist_'}_${
    options.token
  }_`;
  const directory = tmp.dirSync({ prefix });

  return directory.name;
};

const openTextDocument = async (
  dir: string,
  filename: string,
  content: string
): Promise<void> => {
  try {
    const file = path.join(dir, filename);
    fs.writeFileSync(file, content);
    const textDocument = await workspace.openTextDocument(file);
    await window.showTextDocument(textDocument);
    commands.executeCommand('workbench.action.keepEditor');
  } catch (err) {
    logger.error(err);
  }
};

export { openCodeBlock };
