import * as vscode from 'vscode';
import * as tmp from 'tmp';
import * as fs from 'fs';
import * as path from 'path';
import { StorageBlock, StorageService } from './services/storage.service';

export class Commands {

  private _provider: StorageService;

  constructor(codeFileServices: { [provider: string]: StorageService; }) {
    // TODO: This is a placeholder for future development.
    const providerKey = Object.keys(codeFileServices)[0];
    this._provider = codeFileServices[providerKey];
  }

  async openCodeBlock() {
    try {
      const codeBlock = await this._selectCodeBlock();
      if (!codeBlock) {
        return;
      }
      const directory = this._createTmpDir(codeBlock.id);

      // Is there an active text editor?
      if (vscode.window.activeTextEditor) {
        // Close it
        await vscode.commands.executeCommand('workbench.action.closeOtherEditors');
      }

      // Open an editor for each file in CodeFile
      let i = 0;
      for(let fileName in codeBlock.files) {
        i++;
        let file = codeBlock.files[fileName];
        if (i > 1) {
          await vscode.commands.executeCommand('workbench.action.focusFirstEditorGroup');
          await vscode.commands.executeCommand('workbench.action.splitEditor');
        }
        await this._openTextDocument(directory, fileName, file.content);
      }
    } catch (error) {
      this._showError(error);
    }
  }

  async onSaveTextDocument(doc: vscode.TextDocument) {
    const {storageBlockId, fileName} = this._getCodeFileDetails(doc);
    try {
      if (storageBlockId) {
        await this._provider.editFile(storageBlockId, fileName, doc);
        await vscode.window.showInformationMessage('Gist file saved.');
      }
    } catch (error) {
      this._showError(error);
    }
  }

  private _getCodeFileDetails(doc: vscode.TextDocument) {
    let sep = (path.sep === '\\') ? '\\\\' : path.sep;
    let regexp = new RegExp(`.*vscode_gist_([^_]*)_[^${sep}]*${sep}(.*)`);
    let matches = doc.fileName.match(regexp);
    if (matches) {
      return {
        path: path.dirname(matches[0]),
        storageBlockId: matches[1],
        fileName: matches[2],
      };
    }
  }

  private async _selectCodeBlock() {
    await this._loginUser();
    const files: StorageBlock[] = await this._provider.list();
    const selectedFile = await vscode.window.showQuickPick<StorageBlock>(files);
    if (selectedFile) {
      return this._provider.getStorageBlock(selectedFile.url);
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

  private _showError(error: any) {
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