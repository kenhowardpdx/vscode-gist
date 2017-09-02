import { workspace, TextEdit, TextEditor, WorkspaceEdit, Range } from './modules/vscode';

/**
 * Inserts text into code editor at cursor position
 * @param {TextEditor} editor 
 * @param {string} text 
 */
export async function insertText(editor: TextEditor, text: string) {
  const document = editor.document;
  const workspaceEdit = new WorkspaceEdit();
  const range = new Range(editor.selection.start, editor.selection.end);
  const edit = new TextEdit(range, text);
  workspaceEdit.set(document.uri, [edit]);
  return workspace.applyEdit(workspaceEdit);
}