import * as vscode from 'vscode';
import * as tmp from 'tmp';
import * as fs from 'fs';
import * as path from 'path';

export class Commands {

  private _provider: StorageService;

  constructor(codeFileServices: { [provider: string]: StorageService; }) {
    // TODO: This is a placeholder for future development.
    const providerKey = Object.keys(codeFileServices)[0];
    this._provider = codeFileServices[providerKey];
  }

  async openCodeBlock() {
    try {
      const file = await this._selectCodeBlock();
      const directory = this._createTmpDir(file.id);

      // Is there an active text editor?
      if (vscode.window.activeTextEditor) {
        // Close it
        await vscode.commands.executeCommand('workbench.action.closeOtherEditors');
      }

      // Open an editor for each file in CodeFile
      let i = 0;
      for(let f in file.files) {
        i++;
        let _file = file.files[f];
        if (i > 1) {
          await vscode.commands.executeCommand('workbench.action.focusFirstEditorGroup');
          await vscode.commands.executeCommand('workbench.action.splitEditor');
        }
        await this._openTextDocument(directory, f, _file.content);
      }
    } catch (error) {
      let msg: string;
      if (typeof error === 'string') {
        msg = error;
      } else if (error && error.message) {
        msg = error.message;
      } else {
        msg = 'An error occurred while opening the editor.';
      }
      console.error(error);
      vscode.window.showErrorMessage(msg);
    }
  }

  private async _selectCodeBlock() {
    await this._loginUser();
    const files: StorageBlock[] = await this._provider.list();
    const selectedFile = await vscode.window.showQuickPick<StorageBlock>(files);
    if (selectedFile) {
      return this._provider.getFileByUrl(selectedFile.url);
    }
  }

  private _createTmpDir(key: string, options = { prefix: 'vscode_gist_' }): string {
      const prefix = options.prefix + key + '_';
      const directory = tmp.dirSync({ prefix });
      return directory.name;
  }
  
  private async _openTextDocument(dir, filename, content) {
    let file = path.join(dir, filename);
    fs.writeFileSync(file, content);
    return vscode.workspace.openTextDocument(file)
      .then((doc: vscode.TextDocument) => vscode.window.showTextDocument(doc));
  }
  
  private async _loginUser() {
    const providerName = this._provider.name;
    if (this._provider.isAuthenticated()) {
      return Promise.resolve();
    }
    const username: string = (await vscode.window.showInputBox({
      prompt: `Enter your ${providerName} username`
    })).trim();
    const password: string = (await vscode.window.showInputBox({
      prompt: `Enter your ${providerName} password.`
    })).trim();
    await this._provider.login(username, password);
  }
}