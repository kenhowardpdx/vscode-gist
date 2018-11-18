import { window } from 'vscode';

import { logger } from '../logger';

const _notify = (type: 'error' | 'info', ...messages: string[]): void => {
  const formattedMessage = [...messages]
    .filter((m?: string) => typeof m !== 'undefined')
    .join(' > ');
  switch (type) {
    case 'error':
      window.showErrorMessage(`GIST ERROR: ${formattedMessage}`);
      break;
    case 'info':
      window.showInformationMessage(`GIST: ${formattedMessage}`);
      break;
    default:
      logger.error(`Invalid Notify Type "${type}"`);
  }
};

const error = (...messages: string[]): void => {
  _notify('error', ...messages);
};

const info = (...messages: string[]): void => {
  _notify('info', ...messages);
};

export const notify = {
  error,
  info
};
