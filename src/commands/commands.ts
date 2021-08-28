import { commands, Disposable } from 'vscode';

import * as utils from '../utils';

import * as gists from './gists';
import * as profiles from './profiles';
import * as status from './status-bar';

const commandInitializers: CommandInitializer[] = [
  gists.add,
  gists.create,
  gists.createConfirmation,
  gists.deleteCommand,
  gists.deleteFile,
  gists.insert,
  gists.insertFavorite,
  gists.open,
  gists.openFavorite,
  gists.openInBrowser,
  gists.updateAccessKey,
  profiles.create,
  profiles.select,
  status.update
];

const init = (
  config: Configuration,
  services: Services,
  initializers: CommandInitializer[] = commandInitializers
): { commandCount: number; commands: Disposable[] } => {
  const { logger } = services;

  const registerCommand = (commandInit: CommandInitializer): Disposable => {
    const [command, commandFn] = commandInit(config, services, utils);

    return commands.registerCommand(command, commandFn);
  };

  const registered = initializers.map(registerCommand);

  logger.debug('initializing commands');

  return { commandCount: registered.length, commands: registered };
};

export { init };
