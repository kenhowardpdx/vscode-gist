import { window, workspace, commands, Memento, TextDocument, StatusBarItem, StatusBarAlignment } from '../modules/vscode';
import * as tmp from 'tmp';
import * as fs from 'fs';
import * as path from 'path';
import open = require('open');
import { StorageBlock, StorageService, QuickPickStorageBlock } from '../services/storage.service';
import { insertText } from '../helpers';

const MAX_FILES = workspace.getConfiguration('gist').get<number>('codeBlockFileNotificationThreshold');
export class MainController {

  private _provider: StorageService;
  private _providers: StorageService[] = [];
  private _store: Memento;
  private _statusBarItem: StatusBarItem;

  private static _instance: MainController;

  static get instance() {
    if (!MainController._instance) {
      MainController._instance = new MainController();
    }
    return MainController._instance;
  }

  private constructor() {}

  addProvider(provider: StorageService) {
    this._providers.push(provider);
  }

  setStore(store: Memento) {
    this._store = store;
  }

  async authExec(command: string, ...args) {
    if (!this._provider || !(this._provider && this._provider.isAuthenticated())) {
      return; // exit if the user has not been authenticated
    }
    await this.exec(command, ...args);
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

  updateStatusBar() {
    if (!this._statusBarItem) {
      this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
    }

    // check if provider is in store
    const provider = this._getProviderName();

    if (provider) {
      this._statusBarItem.text = `GIST [${provider}]`;
      this._statusBarItem.command = 'extension.logOut';
      this._statusBarItem.show();
    } else {
      this._statusBarItem.hide();
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
      let openSingle = false;

      if (Object.keys(codeBlock.files).length > MAX_FILES) {
        openSingle = 'Open Single File' === (await window.showInformationMessage(`Selected Block Contains More Than ${MAX_FILES} Files.`, 'Open Single File', 'Open All'));
      }

      if (openSingle) {
        // selected file to insert
        const file = await this._selectFileFromCodeBlock(codeBlock);
        if (!file) {
          return;
        }
        await this._openTextDocument(directory, file.filename, file.content);
      } else {
        // Open an editor for each file in CodeFile
        for(let filename in codeBlock.files) {
          let file = codeBlock.files[filename];
          await this._openTextDocument(directory, filename, file.content);
        }
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
      .then((doc: TextDocument) => window.showTextDocument(doc))
      .then(() => commands.executeCommand('workbench.action.keepEditor'));
  }

  private async _loginUser() {
    const providerName = this._provider.name;
    const username: string = (await window.showInputBox({
      prompt: `Enter your ${providerName} username`
    }));
    if (!username) {
      return await this._setToken();
    }
    const password: string = (await window.showInputBox({
      prompt: `Enter your ${providerName} password.`,
      password: true
    }));
    if (!password) {
      return;
    }
    await this._provider.login(username.trim(), password.trim());
  }

  private async _setToken() {
    const token = (await window.showInputBox({
      prompt: `Enter your ${this._provider.name} access token`
    }));
    if (!token) {
      return;
    }
    await this._provider.setToken(token);
  }

  private async _logoutUser(auto = false) {
    const logOut: string = auto === true ? 'Yes' : (await window.showWarningMessage('Would you like to log out?', 'Yes'));
    if (logOut === 'Yes') {
      await this._provider.logout();
      this._setProvider(null);
      if (!auto) {
        await this._notify('User Logged Out');
      }
      this.updateStatusBar();
    }
  }

  private async _selectProvider() {
    if (!this._providers) {
      throw new Error('Missing Providers');
    }

    const providerName = this._getProviderName();

    if (providerName) {
      this._provider = this._providers.slice().filter(p => p.name === providerName).shift();
      return Promise.resolve();
    } else if (this._providers.length === 1) {
      this._setProvider(this._providers.slice().shift());
      return Promise.resolve();
    } else {
      const selectedProvider = await window.showQuickPick<StorageService>(this._providers);
      if (!selectedProvider) {
        throw new Error('Provider not selected');
      }
      this._setProvider(selectedProvider);
      return Promise.resolve();
    }
  }

  private async _showError(error: any) {
      let msg: string;
      if (typeof error === 'string') {
        msg = error;
      } else if (error && error.message) {
        msg = error.message;
        if (typeof error.message === 'string') {
          try {
            msg = JSON.parse(msg).message;
          } catch (err) {
            // do nothing.
          }
        }
      } else {
        msg = 'An unknown error occurred';
      }

      console.error(msg);

      if (msg === 'Bad credentials') {
        await this._logoutUser(true);
      }

      // Prefix message w/ 'GIST ERROR:' so the user knows
      // where the error is coming from.
      return window.showErrorMessage(`GIST ERROR: ${msg} [${this._provider.name}]`);
  }

  private _prompt(message: string, value?: string) {
    return window.showInputBox({ prompt: message, value });
  }

  private _notify(message: string) {
    return window.showInformationMessage(`GIST MESSAGE: ${message} ${ this._provider ? `[${this._provider.name}]` : ''}`);
  }

  private _getFileNameFromPath(filePath: string) {
    return path.basename(filePath);
  }

  private _getProviderName() {
    return this._store.get('gist_provider') || this._provider && this._provider.name;
  }

  private _setProvider(provider: StorageService) {
    this._store.update('gist_provider', provider && provider.name);
    this._provider = provider;
  }
}
