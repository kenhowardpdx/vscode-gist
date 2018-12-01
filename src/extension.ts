import { commands, ExtensionContext, workspace } from 'vscode';

import {
  createCodeBlock,
  createProfile,
  openCodeBlock,
  openFavoriteCodeBlock,
  selectProfile,
  updateCodeBlock,
  updateGistAccessKey,
  updateStatusBar
} from './commands';
import { DEBUG } from './constants';
import { insights } from './insights';
import { Levels, logger } from './logger';
import { extensionMigrations, migrations } from './migrations';
import { profiles } from './profiles';

export function activate(context: ExtensionContext): void {
  logger.setLevel(DEBUG ? Levels.DEBUG : Levels.ERROR);

  logger.debug('extension activated');

  migrations.configure({
    migrations: extensionMigrations,
    state: context.globalState
  });
  profiles.configure({ state: context.globalState });

  /**
   * General Commands
   */
  commands.registerCommand('extension.resetState', () => {
    context.globalState.update('gisttoken', undefined);
    context.globalState.update('gist_provider', undefined);
    context.globalState.update('profiles', undefined);
    context.globalState.update('migrations', undefined);
    commands.executeCommand('extension.updateStatusBar');
  });

  /**
   * Gist Commands
   */
  commands.registerCommand('extension.openCodeBlock', openCodeBlock);
  commands.registerCommand(
    'extension.openFavoriteCodeBlock',
    openFavoriteCodeBlock
  );
  commands.registerCommand('extension.createCodeBlock', createCodeBlock);
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

  /**
   * Status Bar
   */
  commands.registerCommand('extension.updateStatusBar', updateStatusBar);

  /**
   * Execute Startup Commands
   */
  migrations.up((err, results) => {
    commands.executeCommand('extension.updateStatusBar');
    commands.executeCommand('extension.updateGistAccessKey');

    if (err) {
      insights.exception('migrations', { message: err.message });
    }

    insights.track('activated', undefined, {
      migrationCount: results.migrated.length
    });
  });

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
