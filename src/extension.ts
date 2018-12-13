import { commands, Disposable, ExtensionContext } from 'vscode';

import { init as initCommands } from './commands';
import { DEBUG } from './constants';
import * as gists from './gists';
import { insights } from './insights';
import { init as initListeners } from './listeners';
import { Levels, logger } from './logger';
import { extensionMigrations, migrations } from './migrations';
import { profiles } from './profiles';

const disposables: { commands: Disposable[]; listeners: Disposable[] } = {
  commands: [],
  listeners: []
};

export function activate(context: ExtensionContext): void {
  logger.setLevel(DEBUG ? Levels.DEBUG : Levels.ERROR);

  logger.debug('extension activated');

  migrations.configure({
    migrations: extensionMigrations,
    state: context.globalState
  });
  profiles.configure({ state: context.globalState });

  disposables.commands = initCommands({ gists, insights, logger, profiles });
  disposables.listeners = initListeners({ gists, insights, logger, profiles });

  /**
   * General Commands
   */
  commands.registerCommand('extension.resetState', () => {
    context.globalState.update('gisttoken', undefined);
    context.globalState.update('gist_provider', undefined);
    context.globalState.update('profiles', undefined);
    context.globalState.update('migrations', undefined);
    commands.executeCommand('extension.status.update');
  });

  /**
   * Execute Startup Commands
   */
  migrations.up((err, results) => {
    commands.executeCommand('extension.status.update');
    commands.executeCommand('extension.gist.updateAccessKey');

    if (err) {
      insights.exception('migrations', { message: err.message });
    }

    insights.track('activated', undefined, {
      migrationCount: results.migrated.length
    });
  });

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
  // TODO: close open gist editors
  disposables.commands.forEach((d) => d.dispose());
  disposables.listeners.forEach((d) => d.dispose());
}
