import { StatusBarAlignment, window } from 'vscode';

import { profiles } from '../profiles';

import { logger } from '../logger';

const statusBar = window.createStatusBarItem(StatusBarAlignment.Left);
statusBar.show();

export const updateStatusBar = (): void => {
  const activeProfile = profiles.get();
  statusBar.text = `GIST ${
    activeProfile ? `[${activeProfile.name}]` : '[Create Profile]'
  }`;
  statusBar.command = activeProfile
    ? 'extension.toggleProfile'
    : 'extension.createProfile';

  logger.debug('Status Bar Updated');
};
