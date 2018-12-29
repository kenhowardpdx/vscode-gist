import {
  commands,
  Disposable,
  ExtensionContext,
  window,
  workspace
} from 'vscode';

import { init as initCommands } from './commands';
import { DEBUG, EXTENSION_ID } from './constants';
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
  logger.setOutput(window.createOutputChannel('Gist'));

  logger.debug('extension activated');

  migrations.configure({
    migrations: extensionMigrations,
    state: context.globalState
  });
  profiles.configure({ state: context.globalState });

  const config = workspace.getConfiguration('gist');

  disposables.commands = initCommands(config, {
    gists,
    insights,
    logger,
    profiles
  });
  disposables.listeners = initListeners(config, {
    gists,
    insights,
    logger,
    profiles
  });

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
}

export function deactivate(): void {
  // TODO: close open gist editors
  disposables.commands.forEach((d) => d.dispose());
  disposables.listeners.forEach((d) => d.dispose());
}
