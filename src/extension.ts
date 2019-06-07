
import {
  commands,
  Disposable,
  ExtensionContext,
  extensions,
  window,
  workspace
} from 'vscode';

import { init as initCommands } from './commands';
import { GistCommands, StatusBarCommands } from './commands/extension-commands';
import { DEBUG, EXTENSION_ID } from './constants';
import * as gists from './gists';
import { GistsExplorer } from './gists-explorer';
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
  const extension = extensions.getExtension(EXTENSION_ID) as Extension;
  const previousVersion = context.globalState.get('version');
  const currentVersion = extension.packageJSON.version;

  // tslint:disable-next-line:no-unused-expression
  new GistsExplorer(context, gists);

  // Gist Provider
  // const gistsProvider = new GistsProvider();
  // window.registerTreeDataProvider('gists', gistsProvider);
  // commands.registerCommand('gists.onDidExpandElement', () => window.showInformationMessage('Yup!'));
  // commands.registerCommand('gists.onDidCollapseElement', () => window.showInformationMessage('RGR!'));

  // Starred Gist Provider
  // const starredGistsProvider = new GistsProvider({ starred: true });
  // window.registerTreeDataProvider('starred-gists', starredGistsProvider);

  // Command Pallette Commands
  const extCommands = initCommands(config, {
    gists,
    insights,
    logger,
    profiles
  });
  const extListeners = initListeners(config, {
    gists,
    insights,
    logger,
    profiles
  });

  disposables.commands = extCommands.commands;
  disposables.listeners = extListeners.listeners;

  /**
   * General Commands
   */
  commands.registerCommand('extension.resetState', () => {
    context.globalState.update('gisttoken', undefined);
    context.globalState.update('gist_provider', undefined);
    context.globalState.update('profiles', undefined);
    context.globalState.update('migrations', undefined);

    commands.executeCommand(StatusBarCommands.Update);
    commands.executeCommand(GistCommands.UpdateAccessKey);
  });

  /**
   * Execute Startup Commands
   */
  migrations.up((err, results) => {
    commands.executeCommand(StatusBarCommands.Update);
    commands.executeCommand(GistCommands.UpdateAccessKey);

    if (err) {
      insights.exception('migrations', { message: err.message });
    }

    if (previousVersion !== currentVersion) {
      // TODO: show what's new
      context.globalState.update('version', currentVersion);
    }

    insights.track('activated', undefined, {
      commandCount: extCommands.commandCount,
      listenerCount: extListeners.listenerCount,
      migrationCount: results.migrated.length
    });
  });
}

export function deactivate(): void {
  // TODO: close open gist editors
  // tslint:disable-next-line:no-unsafe-any
  disposables.commands.forEach((d) => d.dispose());
  // tslint:disable-next-line:no-unsafe-any
  disposables.listeners.forEach((d) => d.dispose());
}
