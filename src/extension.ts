import * as vscode from 'vscode';

import { openCodeBlock } from './commands';
import { Levels, logger } from './logger';

export function activate(_: vscode.ExtensionContext): void {
  const debug = process.env.DEBUG === 'true';
  logger.setLevel(debug ? Levels.DEBUG : Levels.ERROR);

  logger.debug('extension activated');
  vscode.commands.registerCommand('extension.openCodeBlock', openCodeBlock);
  vscode.commands.registerCommand(
    'extension.openFavoriteCodeBlock',
    (): void => {
      // intentionally left blank
    }
  );
  vscode.commands.registerCommand(
    'extension.createCodeBlock',
    (): void => {
      // intentionally left blank
    }
  );
  vscode.commands.registerCommand(
    'extension.openCodeBlockInBrowser',
    (): void => {
      // intentionally left blank
    }
  );
  vscode.commands.registerCommand(
    'extension.deleteCodeBlock',
    (): void => {
      // intentionally left blank
    }
  );
  vscode.commands.registerCommand(
    'extension.removeFileFromCodeBlock',
    (): void => {
      // intentionally left blank
    }
  );
  vscode.commands.registerCommand(
    'extension.addToCodeBlock',
    (): void => {
      // intentionally left blank
    }
  );
  vscode.commands.registerCommand(
    'extension.changeCodeBlockDescription',
    (): void => {
      // intentionally left blank
    }
  );
  vscode.commands.registerCommand(
    'extension.insertCode',
    (): void => {
      // intentionally left blank
    }
  );

  // context.subscriptions.push(disposable);
}

export function deactivate(): void {
  // intentionally left blank
}
