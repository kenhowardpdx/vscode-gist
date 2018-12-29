import { Disposable, workspace } from 'vscode';

import * as utils from '../utils';

import { getListener } from './extension-listeners';
import { onDidSaveTextDocument } from './on-did-save-text-document';

const listenerInitializers: ListenerInitializer[] = [onDidSaveTextDocument];

const init = (
  config: Configuration,
  services: Services,
  initializers: ListenerInitializer[] = listenerInitializers
): Disposable[] => {
  const { insights, logger } = services;

  const registerListener = (listenerInit: ListenerInitializer): Disposable => {
    const [listenerIndex, listenerFn] = listenerInit(config, services, utils);

    const listener = getListener(listenerIndex);

    switch (listener) {
      case 'onDidChangeConfiguration':
        return workspace.onDidChangeConfiguration(listenerFn);
      case 'onDidChangeTextDocument':
        return workspace.onDidChangeTextDocument(listenerFn);
      case 'onDidChangeWorkspaceFolders':
        return workspace.onDidChangeWorkspaceFolders(listenerFn);
      case 'onDidCloseTextDocument':
        return workspace.onDidCloseTextDocument(listenerFn);
      case 'onDidOpenTextDocument':
        return workspace.onDidOpenTextDocument(listenerFn);
      case 'onDidSaveTextDocument':
        return workspace.onDidSaveTextDocument(listenerFn);
      case 'onWillSaveTextDocument':
        return workspace.onWillSaveTextDocument(listenerFn);
      default:
        throw new Error('invalid listener');
    }
  };

  const registered = initializers.map(registerListener);

  logger.debug('initializing commands');
  insights.track('commands', undefined, { commandCount: registered.length });

  return registered;
};

export { init };
