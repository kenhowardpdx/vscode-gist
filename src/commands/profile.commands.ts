import { commands, MessageItem, QuickPickItem, window } from 'vscode';

import { insights } from '../insights';
import { logger } from '../logger';
import { profiles } from '../profiles';
import { notify } from '../utils';

export const createProfile = async (): Promise<void> => {
  try {
    const { title } = (await window.showInformationMessage(
      'Which GitHub Platform?',
      { modal: true },
      { title: 'GitHub.com (common)', isCloseAffordance: true },
      { title: 'GitHub Enterprise' }
    )) as MessageItem;

    const url =
      title === 'GitHub Enterprise'
        ? await window.showInputBox({ prompt: 'Enter your enterprise API url' })
        : 'https://api.github.com';

    if (!url) {
      logger.debug('User Aborted Create Profile at "url"');

      return;
    }

    const key = await window.showInputBox({
      prompt: 'Enter your access token'
    });

    if (!key) {
      logger.debug('User Aborted Create Profile at "key"');

      return;
    }

    const name = await window.showInputBox({
      prompt: 'Give this profile a name'
    });

    if (!name) {
      logger.debug('User Aborted Create Profile at "name"');

      return;
    }

    profiles.add(name, key, url, true);
    await commands.executeCommand('extension.updateStatusBar');
    await commands.executeCommand('extension.updateGistAccessKey');
    insights.track('createProfile');
  } catch (err) {
    const error: Error = err as Error;
    logger.error(`createProfile > ${error && error.message}`);
    insights.exception('createProfile', { messsage: error.message });
    notify.error('Unable To Create Profile', error.message);
  }
};

export const selectProfile = async (): Promise<void> => {
  try {
    const allProfiles = profiles.getAll();

    if (!allProfiles || allProfiles.length === 0) {
      commands.executeCommand('extension.createProfile');

      return;
    }

    const qp = allProfiles.map((profile) => ({
      label: profile.name,
      profile
    }));

    const createProfileItem: QuickPickItem = {
      label: 'Create New Profile'
    };

    const selected = (await window.showQuickPick([
      createProfileItem,
      ...qp
    ])) as {
      label: string;
      profile: Profile;
    };

    if (!selected) {
      return;
    }

    if (selected && selected.label !== 'Create New Profile') {
      const { key, name, url } = selected.profile;

      profiles.add(name, key, url, true);
      commands.executeCommand('extension.updateStatusBar');
      commands.executeCommand('extension.updateGistAccessKey');
      insights.track('slectProfile');
    } else {
      commands.executeCommand('extension.createProfile');
    }
  } catch (err) {
    const error: Error = err as Error;
    logger.error(`selectProfile > ${error && error.message}`);
    insights.exception('selectProfile', { messsage: error.message });
    notify.error('Unable To Select Profile', error.message);
  }
};
