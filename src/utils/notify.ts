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

export const error = (...messages: string[]): void => {
  _notify('error', ...messages);
};

export const info = (...messages: string[]): void => {
  _notify('info', ...messages);
};
