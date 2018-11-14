import * as vscode from 'vscode';

import { Levels, Logger } from './logger';

export function activate(_: vscode.ExtensionContext): void {
  const logger = new Logger(Levels.DEBUG);

  logger.debug('extension activated');
  vscode.commands.registerCommand(
    'extension.openCodeBlock',
    (): void => {
      // intentionally left blank
    }
  );
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
