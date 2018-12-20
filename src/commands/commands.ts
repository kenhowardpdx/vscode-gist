import { commands, Disposable } from 'vscode';

import * as utils from '../utils';

import * as gists from './gists';
import * as profiles from './profiles';
import * as status from './status-bar';

const commandInitializers: CommandInitializer[] = [
  gists.add,
  gists.create,
  gists.deleteCommand,
  gists.deleteFile,
  gists.insert,
  gists.open,
  gists.openFavorite,
  gists.openInBrowser,
  gists.updateAccessKey,
  profiles.create,
  profiles.select,
  status.update
];

const init = (
  services: Services,
  initializers: CommandInitializer[] = commandInitializers
): Disposable[] => {
  const { insights, logger } = services;

  const registerCommand = (commandInit: CommandInitializer): Disposable => {
    const [command, commandFn] = commandInit(services, utils);

    return commands.registerCommand(command, commandFn);
  };

  const registered = initializers.map(registerCommand);

  logger.debug('initializing commands');
  insights.track('commands', undefined, { commandCount: registered.length });

  return registered;
};

export { init };
