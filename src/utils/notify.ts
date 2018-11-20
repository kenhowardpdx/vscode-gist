import { window } from 'vscode';

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
