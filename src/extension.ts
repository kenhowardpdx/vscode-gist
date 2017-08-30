import { ExtensionContext, commands, workspace } from 'vscode';
import { GistService } from './services/gist.service';
import { Commands } from './commands';

export function activate(context: ExtensionContext) {
  const gist = new GistService(context.globalState);
  const cmd = Commands.instance;

  cmd.setStore(context.globalState);
  cmd.addProvider(gist);

  const subscriptions = context.subscriptions;
  const registerCommand = commands.registerCommand;

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
    registerCommand('extension.insertCode', () => cmd.exec('insertCode'))
  );
  workspace.onDidSaveTextDocument((doc) => cmd.exec('onSaveTextDocument', doc));
}