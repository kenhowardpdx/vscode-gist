import { commands, MessageItem, QuickPickItem, window } from 'vscode';

import { insights } from '../insights';
import { logger } from '../logger';
import { profiles } from '../profiles';

export const createProfile = async (): Promise<void> => {
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

  const key = await window.showInputBox({ prompt: 'Enter your access token' });

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
  commands.executeCommand('extension.updateStatusBar');
  commands.executeCommand('extension.updateGistAccessKey');
  insights.track('createProfile');
};

export const selectProfile = async (): Promise<void> => {
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

  const selected = (await window.showQuickPick([createProfileItem, ...qp])) as {
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
};

export const clearProfiles = (): void => {
  profiles.reset();
  commands.executeCommand('extension.updateStatusBar');
  insights.track('clearProfiles');
};
