import { window, workspace, commands, Memento, TextDocument } from '../modules/vscode';
import * as tmp from 'tmp';
import * as fs from 'fs';
import * as path from 'path';
import open = require('open');
import { StorageBlock, StorageService, QuickPickStorageBlock } from '../services/storage.service';
import { insertText } from '../helpers';

export class Commands {

  private _provider: StorageService;
  private _providers: StorageService[] = [];
  private _store: Memento;

  private static _instance: Commands;

  static get instance() {
    if (!Commands._instance) {
      Commands._instance = new Commands();
    }
    return Commands._instance;
  }

  private constructor() {}

  addProvider(provider: StorageService) {
    this._providers.push(provider);
  }

  setStore(store: Memento) {
    this._store = store;
  }

  async exec(command: string, ...args) {
    try {
      if (!this._provider) {
        await this._selectProvider();
      }
      if (!this._provider.isAuthenticated()) {
        await this._loginUser();
      }
      return this[`_${command}`](...args);
    } catch (error) {
      this._showError(error);
    }
  }

  /**
   * User selects code block from quick pick menu, files open
   */
  private async _openCodeBlock(favorite = false) {
    try {
      // codeBlock is selected by user
      const codeBlock = await this._selectCodeBlock(favorite);
      if (!codeBlock) {
        return;
      }
      const directory = this._createTmpDir(codeBlock.id);

      // Is there an active text editor?
      if (window.activeTextEditor) {
        // Close it
        await commands.executeCommand('workbench.action.closeOtherEditors');
      }

      // Open an editor for each file in CodeFile
      let i = 0;
      for(let fileName in codeBlock.files) {
        i++;
        let file = codeBlock.files[fileName];
        if (i > 1) {
          await commands.executeCommand('workbench.action.focusFirstEditorGroup');
          await commands.executeCommand('workbench.action.splitEditor');
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
  private async _createCodeBlock() {
    try {
      const editor = window.activeTextEditor;
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
  private async _openCodeBlockInBrowser() {
    try {
      const details = this._getCurrentDocument();
      
      const storageBlock = await this._provider.getStorageBlockById(details.storageBlockId);

      open(storageBlock.html_url); // launch user's default browser
    } catch (error) {
      this._showError(error);
    }
  }

  /**
   * Deletes current code block and closes all associated editors
   */
  private async _deleteCodeBlock() {
    try {

      const details = this._getCurrentDocument();
      
      await this._provider.deleteStorageBlock(details.storageBlockId);

      const editors = window.visibleTextEditors;

      // close editors associated to this StorageBlock
      for (let e of editors) {
        let d = this._getCodeFileDetails(e.document);
        if (d && d.storageBlockId === details.storageBlockId) {
          commands.executeCommand('workbench.action.closeActiveEditor');
        }
      }

      this._notify('Block Deleted');
    } catch (error) {
      this._showError(error);
    }
  }

  /**
   * Removes file from code block
   */
  private async _removeFileFromCodeBlock() {
    try {
      const details = this._getCurrentDocument();

      await this._provider.removeFileFromStorageBlock(details.storageBlockId, details.fileName);

      commands.executeCommand('workbench.action.closeActiveEditor');

      this._notify('File Removed From Block');
    } catch (error) {
      this._showError(error);
    }
  }

  /**
   * Add a file or selection to existing code block
   * If file already exists we generate new file name (might need to come back to this)
   */
  private async _addToCodeBlock() {
    try {
      const editor = window.activeTextEditor;
      if (!editor) {
        throw new Error('Open a file before adding');
      }
      const selection = editor.selection;
      const text = editor.document.getText(selection.isEmpty ? undefined : selection);
      let fileName = this._getFileNameFromPath(editor.document.fileName) || 'untitled.txt';
      const codeBlock = await this._selectCodeBlock();
      if (!codeBlock) {
        return;
      }
      // check if fileName exists prior to adding new file.
      let i = 1;
      let originalFileName = fileName;
      while (codeBlock.files.hasOwnProperty(fileName)) {
        let extPos = originalFileName.lastIndexOf('.');
        if (extPos === -1) {
          extPos = originalFileName.length;
        }
        let ext = originalFileName.substr(extPos);
        fileName = originalFileName.substring(0, extPos) + i + ext;
        i++;
      }
      await this._provider.editFile(codeBlock.id, fileName, text);
      this._notify('File Added To Block');
    } catch (error) {
      this._showError(error);
    }
  }

  /**
   * Change code block description
   */
  private async _changeCodeBlockDescription() {
    try {
      const details = this._getCurrentDocument();
      const codeBlock = await this._provider.getStorageBlockById(details.storageBlockId);
      const description = await this._prompt('Enter Description', codeBlock.description);
      if (!description) {
        return;
      }
      await this._provider.changeDescription(details.storageBlockId, description);
      this._notify('Block Description Saved');
    } catch (error) {
      this._showError(error);
    }
  }

  /**
   * Inserts code into current file
   */
  private async _insertCode() {
    try {
      const editor = window.activeTextEditor;
      if (!editor) {
        throw new Error('Open a file before inserting');
      }
      // codeBlock is selected by user
      const codeBlock = await this._selectCodeBlock();
      if (!codeBlock) {
        return;
      }
      // selected file to insert
      const file = await this._selectFileFromCodeBlock(codeBlock);
      if (!file) {
        return;
      }
      await insertText(editor, file.content);
    } catch (error) {
      this._showError(error);
    }
  }

  /**
   * User saves a text document
   * @param doc
   */
  private async _onSaveTextDocument(doc: TextDocument) {
    const {storageBlockId, fileName} = this._getCodeFileDetails(doc);
    try {
      if (storageBlockId) {
        await this._provider.editFile(storageBlockId, fileName, doc.getText());
        await this._notify('File Saved To Block');
      }
    } catch (error) {
      this._showError(error);
    }
  }

  private _getCurrentDocument() {
      const doc = (window.activeTextEditor) ? window.activeTextEditor.document : undefined;

      if (!doc) {
        throw new Error('No open documents');
      }

      const details = this._getCodeFileDetails(doc);

      if (!details) {
        throw new Error(`Not a code block in ${this._provider.name}`);
      }

      return details;
  }

  private _getCodeFileDetails(doc: TextDocument) {
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

  private async _selectCodeBlock(favorite = false) {
    const items: QuickPickStorageBlock[] = await this._provider.list(favorite);
    const selectedCodeBlock = await window.showQuickPick(items);
    if (selectedCodeBlock) {
      return this._provider.getStorageBlock(selectedCodeBlock.block.url);
    }
  }

  private async _selectFileFromCodeBlock(codeBlock: StorageBlock) {
    const files = Object.keys(codeBlock.files).map(key => {
      return {
        label: key,
        description: '',
        file: codeBlock.files[key]
      };
    });
    let selectedFile;
    if (files.length > 1) {
      selectedFile = await window.showQuickPick(files);
    } else {
      selectedFile = files[0];
    }
    if (selectedFile) {
      return selectedFile.file;
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
    return workspace.openTextDocument(file)
      .then((doc: TextDocument) => window.showTextDocument(doc));
  }
  
  private async _loginUser() {
    const providerName = this._provider.name;
    const username: string = (await window.showInputBox({
      prompt: `Enter your ${providerName} username`
    })).trim();
    const password: string = (await window.showInputBox({
      prompt: `Enter your ${providerName} password.`,
      password: true
    })).trim();
    await this._provider.login(username, password);
  }

  private async _selectProvider() {
    if (!this._providers) {
      throw new Error('Missing Providers');
    }

    if (this._providers.length === 1) {
      this._provider = this._providers.slice().shift();
      return Promise.resolve();
    } else {
      const selectedProvider = await window.showQuickPick<StorageService>(this._providers);
      this._provider = selectedProvider;
      if (!this._provider) {
        throw new Error('Provider not selected');
      }
      return Promise.resolve();
    }
  }

  private _showError(error: any) {
      let msg: string;
      if (typeof error === 'string') {
        msg = error;
      } else if (error && error.message) {
        msg = error.message;
      } else {
        msg = 'An unknown error occurred';
      }
      
      console.error(error);

      // Prefix message w/ 'GIST ERROR:' so the user knows
      // where the error is coming from.
      window.showErrorMessage(`GIST ERROR: ${msg} [${this._provider.name}]`);
  }

  private _prompt(message: string, value?: string) {
    return window.showInputBox({ prompt: message, value });
  }

  private _notify(message: string) {
    return window.showInformationMessage(`GIST MESSAGE: ${message} [${this._provider.name}]`);
  }

  private _getFileNameFromPath(filePath: string) {
    return path.basename(filePath);
  }
}