import { ExtensionContext, commands, workspace, extensions } from './modules/vscode';
import { GistService } from './services/gist.service';
import { MainController } from './controllers/main.controller';

export function activate(context: ExtensionContext) {
  const {
    globalState,
    subscriptions
  } = context;
  const gist = new GistService(context.globalState);
  const registerCommand = commands.registerCommand;
  const cmd = MainController.instance;

  cmd.setStore(context.globalState);
  cmd.addProvider(gist);

  // This will need to be removed in a future release
  const deprecatedToken = workspace.getConfiguration('gist').get<string>('oauth_token');
  
  if (deprecatedToken) {
    gist.setToken(deprecatedToken);
  }

  cmd.updateStatusBar();

  subscriptions.push(
    registerCommand('extension.openCodeBlock', () => cmd.exec('openCodeBlock').then(() => cmd.updateStatusBar())),
    registerCommand('extension.openFavoriteCodeBlock', () => cmd.exec('openCodeBlock', true).then(() => cmd.updateStatusBar())),
    registerCommand('extension.createCodeBlock', () => cmd.exec('createCodeBlock').then(() => cmd.updateStatusBar())),
    registerCommand('extension.openCodeBlockInBrowser', () => cmd.exec('openCodeBlockInBrowser').then(() => cmd.updateStatusBar())),
    registerCommand('extension.deleteCodeBlock', () => cmd.exec('deleteCodeBlock').then(() => cmd.updateStatusBar())),
    registerCommand('extension.removeFileFromCodeBlock', () => cmd.exec('removeFileFromCodeBlock').then(() => cmd.updateStatusBar())),
    registerCommand('extension.addToCodeBlock', () => cmd.exec('addToCodeBlock').then(() => cmd.updateStatusBar())),
    registerCommand('extension.changeCodeBlockDescription', () => cmd.exec('changeCodeBlockDescription').then(() => cmd.updateStatusBar())),
    registerCommand('extension.insertCode', () => cmd.exec('insertCode').then(() => cmd.updateStatusBar())),
    registerCommand('extension.logOut', () => cmd.exec('logoutUser').then(() => cmd.updateStatusBar())),
    registerCommand('extension.initialize', () => cmd.updateStatusBar()) // For testing purposes
  );
  workspace.onDidSaveTextDocument((doc) => cmd.exec('onSaveTextDocument', doc));
}

/**
 * Exposed for testing purposes
 */
export function getController(): MainController {
  return MainController.instance;
}
