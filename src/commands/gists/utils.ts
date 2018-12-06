import { commands, window, workspace } from 'vscode';

import * as utils from '../../utils';

const _openDocument = async (file: string): Promise<void> => {
  const doc = await workspace.openTextDocument(file);
  await window.showTextDocument(doc);
  commands.executeCommand('workbench.action.keepEditor');
};

const openGist = async (
  gist: Gist
): Promise<{
  fileCount: number;
  files: { [x: string]: { content: string } };
  id: string;
}> => {
  const { id, files, fileCount } = gist;
  const filePaths = utils.files.filesSync(id, files);

  // await is not available not available in forEach
  for (const filePath of filePaths) {
    await _openDocument(filePath);
  }

  return { id, files, fileCount };
};

export { openGist };
