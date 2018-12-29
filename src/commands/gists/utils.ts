import {
  commands,
  Position,
  Range,
  Selection,
  // TextEdit,
  TextEditor,
  window,
  workspace,
  WorkspaceEdit
} from 'vscode';

import * as utils from '../../utils';

const _openDocument = async (file: string): Promise<void> => {
  const doc = await workspace.openTextDocument(file);
  await window.showTextDocument(doc);
  commands.executeCommand('workbench.action.keepEditor');
};

const selectFile = async (gist: {
  files: { [name: string]: { content: string } };
}): Promise<{ content: string; filename: string } | undefined> => {
  const files = Object.keys(gist.files).map((key) => ({
    description: '',
    [key]: gist.files[key],
    label: key
  }));
  const selectedFile =
    files.length > 1
      ? await window.showQuickPick(files)
      : await Promise.resolve(files[0]);

  return selectedFile
    ? {
        content: gist.files[selectedFile.label].content,
        filename: selectedFile.label
      }
    : undefined;
};

const openGist = async (
  gist: Gist,
  maxFiles = 10
): Promise<{
  fileCount: number;
  files: { [x: string]: { content: string } };
  id: string;
}> => {
  const { id, files, fileCount } = gist;

  if (fileCount > maxFiles) {
    const file = await selectFile(gist);
    if (!file) {
      throw new Error('File not found');
    }
    const filePath = utils.files.fileSync(id, file.filename, file.content);
    await _openDocument(filePath);
  } else {
    const filePaths = utils.files.filesSync(id, files);

    // await is not available not available in forEach
    for (const filePath of filePaths) {
      await _openDocument(filePath);
    }
  }

  return { id, files, fileCount };
};

const insertText = async (
  editor: TextEditor,
  text: string
): Promise<boolean> => {
  const document = editor.document;
  const workspaceEdit = new WorkspaceEdit();
  const range = new Range(editor.selection.start, editor.selection.end);
  workspaceEdit.replace(document.uri, range, text);

  return workspace.applyEdit(workspaceEdit).then((applied: boolean) => {
    if (applied) {
      const lines = text.trim().split('\n');
      const endPosition = new Position(
        lines.length + range.start.line - 1,
        lines[lines.length - 1].length
      );

      const selection = new Selection(range.start, endPosition);
      editor.selection = selection;
    }

    return applied;
  });
};

export { insertText, openGist, selectFile };
