import { commands, ExtensionContext, workspace } from 'vscode';

import {
  clearProfiles,
  createProfile,
  openCodeBlock,
  selectProfile,
  updateCodeBlock,
  updateGistAccessKey,
  updateStatusBar
} from './commands';
import { DEBUG } from './constants';
import { insights } from './insights';
import { Levels, logger } from './logger';
import { profiles } from './profiles';

export function activate(context: ExtensionContext): void {
  logger.setLevel(DEBUG ? Levels.DEBUG : Levels.ERROR);

  logger.debug('extension activated');

  profiles.configure({ state: context.globalState });

  /**
   * Gist Commands
   */
  commands.registerCommand('extension.openCodeBlock', openCodeBlock);
  workspace.onDidSaveTextDocument(updateCodeBlock);
  commands.registerCommand(
    'extension.updateGistAccessKey',
    updateGistAccessKey
  );

  /**
   * Profile Commands
   */
  commands.registerCommand('extension.toggleProfile', selectProfile);
  commands.registerCommand('extension.createProfile', createProfile);
  commands.registerCommand('extension.clearProfiles', clearProfiles);

  /**
   * Status Bar
   */
  commands.registerCommand('extension.updateStatusBar', updateStatusBar);

  /**
   * Execute Startup Commands
   */
  commands.executeCommand('extension.updateStatusBar');
  commands.executeCommand('extension.updateGistAccessKey');

  insights.track('activated');

  commands.registerCommand(
    'extension.openFavoriteCodeBlock',
    (): void => {
      // intentionally left blank
    }
  );
  commands.registerCommand(
    'extension.createCodeBlock',
    (): void => {
      // intentionally left blank
    }
  );
  commands.registerCommand(
    'extension.openCodeBlockInBrowser',
    (): void => {
      // intentionally left blank
    }
  );
  commands.registerCommand(
    'extension.deleteCodeBlock',
    (): void => {
      // intentionally left blank
    }
  );
  commands.registerCommand(
    'extension.removeFileFromCodeBlock',
    (): void => {
      // intentionally left blank
    }
  );
  commands.registerCommand(
    'extension.addToCodeBlock',
    (): void => {
      // intentionally left blank
    }
  );
  commands.registerCommand(
    'extension.changeCodeBlockDescription',
    (): void => {
      // intentionally left blank
    }
  );
  commands.registerCommand(
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
