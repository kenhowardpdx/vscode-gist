import * as vscode from 'vscode';
import * as tmp from 'tmp';
import * as fs from 'fs';
import * as path from 'path';
import open = require('open');
import { StorageBlock, StorageService } from './services/storage.service';

export class Commands {

  private _provider: StorageService;

  constructor(codeFileServices: { [provider: string]: StorageService; }) {
    // TODO: This is a placeholder for future development.
    const providerKey = Object.keys(codeFileServices)[0];
    this._provider = codeFileServices[providerKey];
  }

  /**
   * User selects code block from quick pick menu, files open
   */
  async openCodeBlock() {
    try {
      // codeBlock is selected by user
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

  /**
   * User creates a code block from open file or selected text
   * Resulting code block is opened in browser
   */
  async createCodeBlock() {
    try {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        throw new Error('Open a file before creating');
      }
      let selection = editor.selection;
      let text = editor.document.getText(selection.isEmpty ? undefined : selection);
      let fileName = this._getFileNameFromPath(editor.document.fileName) || 'untitled.txt';
      let description = await this._prompt('Enter description');
      let isPrivate = (await this._prompt('Private? Y = Yes, N = No')).substr(0, 1).toLowerCase() === 'y';
      let storageBlock = await this._provider.createFile(fileName, description, text, isPrivate);
      open(storageBlock.html_url); // launch user's default browser
    } catch (error) {
      this._showError(error);
    }
  }

  /**
   * Opens current code block in browser
   */
  async openCodeBlockInBrowser() {
    try {
      const doc = (vscode.window.activeTextEditor) ? vscode.window.activeTextEditor.document : undefined;

      if (!doc) {
        throw new Error('No open documents');
      }

      const details = this._getCodeFileDetails(doc);

      if (!details) {
        throw new Error('No gist found for selected document');
      }
      
      const storageBlock = await this._provider.getStorageBlockById(details.storageBlockId);

      open(storageBlock.html_url); // launch user's default browser
    } catch (error) {
      this._showError(error);
    }
  }

  /**
   * Deletes current code block and closes all associated editors
   */
  async deleteCodeBlock() {
    try {
      const doc = (vscode.window.activeTextEditor) ? vscode.window.activeTextEditor.document : undefined;

      if (!doc) {
        throw new Error('No open documents');
      }

      const details = this._getCodeFileDetails(doc);

      if (!details) {
        throw new Error('No gist found for selected document');
      }
      
      await this._provider.deleteStorageBlock(details.storageBlockId);

      const editors = vscode.window.visibleTextEditors;

      // close editors associated to this StorageBlock
      for (let e of editors) {
        let d = this._getCodeFileDetails(e.document);
        if (d && d.storageBlockId === details.storageBlockId) {
          vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        }
      }

      this._notify('Deleted');
    } catch (error) {
      this._showError(error);
    }
  }

  /**
   * User saves a text document
   * @param doc
   */
  async onSaveTextDocument(doc: vscode.TextDocument) {
    const {storageBlockId, fileName} = this._getCodeFileDetails(doc);
    try {
      if (storageBlockId) {
        await this._provider.editFile(storageBlockId, fileName, doc.getText());
        await this._notify('File saved');
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

      // Prefix message w/ 'GIST ERROR:' so the user knows
      // where the error is coming from.
      vscode.window.showErrorMessage('GIST ERROR: ' + msg);
  }

  private _prompt(message: string) {
    return vscode.window.showInputBox({ prompt: message });
  }

  private _notify(message: string) {
    return vscode.window.showInformationMessage('GIST: ' + message);
  }

  private _getFileNameFromPath(filePath: string) {
    return path.basename(filePath);
  }
}