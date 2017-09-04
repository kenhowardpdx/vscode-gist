import { ExtensionContext, commands, workspace, extensions } from './modules/vscode';
import { GistService } from './services/gist.service';
import { MainController } from './controllers/main.controller';

let controller: MainController;

export function activate(context: ExtensionContext) {
  const {
    globalState,
    subscriptions
  } = context;
  const gist = new GistService(context.globalState);
  const registerCommand = commands.registerCommand;
  const cmd = controller = MainController.instance;

  cmd.setStore(context.globalState);
  cmd.addProvider(gist);

  // This will need to be removed in a future release
  const deprecatedToken = workspace.getConfiguration('gist').get<string>('oauth_token');
  
  if (deprecatedToken) {
    gist.setToken(deprecatedToken);
  }

  subscriptions.push(
    registerCommand('extension.openCodeBlock', () => cmd.exec('openCodeBlock')),
    registerCommand('extension.openFavoriteCodeBlock', () => cmd.exec('openCodeBlock', true)),
    registerCommand('extension.createCodeBlock', () => cmd.exec('createCodeBlock')),
    registerCommand('extension.openCodeBlockInBrowser', () => cmd.exec('openCodeBlockInBrowser')),
    registerCommand('extension.deleteCodeBlock', () => cmd.exec('deleteCodeBlock')),
    registerCommand('extension.removeFileFromCodeBlock', () => cmd.exec('removeFileFromCodeBlock')),
    registerCommand('extension.addToCodeBlock', () => cmd.exec('addToCodeBlock')),
    registerCommand('extension.changeCodeBlockDescription', () => cmd.exec('changeCodeBlockDescription')),
    registerCommand('extension.insertCode', () => cmd.exec('insertCode')),
    registerCommand('extension.initialize', () => {}) // For testing purposes
  );
  workspace.onDidSaveTextDocument((doc) => cmd.exec('onSaveTextDocument', doc));
}

/**
 * Exposed for testing purposes
 */
export function getController(): MainController {
  return controller;
}