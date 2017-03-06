import { ExtensionContext, commands, workspace } from 'vscode';
import { GistService } from './services/gist.service';
import { Commands } from './commands';

export function activate(context: ExtensionContext) {
  const gist = new GistService(context.globalState, true);
  const cmd = new Commands({ gist });

  const subscriptions = context.subscriptions;
  const registerCommand = commands.registerCommand;

  // This will need to be removed in a future release
  const deprecatedToken = workspace.getConfiguration('gist').get<string>('oauth_token');
  if (deprecatedToken) {
    gist.setToken(deprecatedToken);
  }

  subscriptions.push(registerCommand('extension.openCodeBlock', cmd.openCodeBlock, cmd));
  workspace.onDidSaveTextDocument(cmd.onSaveTextDocument, cmd);
}