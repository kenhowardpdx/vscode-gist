import { commands, QuickPickItem, window } from 'vscode';

import {
  GistCommands,
  ProfileCommands,
  StatusBarCommands
} from '../extension-commands';

const select: CommandInitializer = (
  _config: Configuration,
  services: Services,
  utils: Utils
): [Command, CommandFn] => {
  const { insights, logger, profiles } = services;

  const command = ProfileCommands.Select;

  const commandFn = async (): Promise<void> => {
    try {
      const allProfiles = profiles.getAll();

      if (!allProfiles || allProfiles.length === 0) {
        commands.executeCommand(ProfileCommands.Create);

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
        commands.executeCommand(StatusBarCommands.Update);
        commands.executeCommand(GistCommands.UpdateAccessKey);
        insights.track(command);
      } else {
        commands.executeCommand(ProfileCommands.Create);
      }
    } catch (err) {
      const error: Error = err as Error;
      logger.error(`${command} > ${error && error.message}`);
      insights.exception(command, { message: error.message });
      utils.notify.error(
        'Could Not Select Profile',
        `Reason: ${error.message}`
      );
    }
  };

  return [command, commandFn];
};

export { select };
