import { StatusBarAlignment, window } from 'vscode';

import { insights } from '../insights';
import { logger } from '../logger';
import { profiles } from '../profiles';

const statusBar = window.createStatusBarItem(StatusBarAlignment.Left);
statusBar.show();

export const updateStatusBar = (): void => {
  try {
    const activeProfile = profiles.get();
    statusBar.text = `GIST ${
      activeProfile ? `[${activeProfile.name}]` : '[Create Profile]'
    }`;
    statusBar.command = activeProfile
      ? 'extension.toggleProfile'
      : 'extension.createProfile';

    logger.debug('Status Bar Updated');
  } catch (err) {
    const error: Error = err as Error;
    logger.error(`updateStatusBar > ${error && error.message}`);
    insights.exception('updateStatusBar', { messsage: error.message });
  }
};
