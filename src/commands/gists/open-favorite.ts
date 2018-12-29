import { window } from 'vscode';

import { GistCommands } from '../extension-commands';

import { openGist } from './utils';

const openFavorite: CommandInitializer = (
  config: Configuration,
  services: Services,
  utils: Utils
): [Command, CommandFn] => {
  const { gists, insights, logger } = services;

  const command = GistCommands.OpenFavorite;

  const format = (list: Gist[]): QuickPickGist[] =>
    list.map((item, i, j) => ({
      block: item,
      description: `${item.public ? 'PUBLIC' : 'PRIVATE'} - Files: ${
        item.fileCount
      } - Created: ${item.createdAt} - Updated: ${item.updatedAt}`,
      label: `${j.length - i}. ${item.name}`
    }));

  const commandFn = async (): Promise<void> => {
    let gistName = '';
    try {
      logger.info(`User Activated ${command}`);

      const list = await gists.getGists(true);

      const selected = await window.showQuickPick(format(list));
      if (selected) {
        gistName = `"${selected.block.name}"`;
        logger.info(`User Selected Gist: "${selected.label}"`);

        const { fileCount } = await openGist(
          await gists.getGist(selected.block.id),
          config.get<number>('maxFiles')
        );

        logger.info('Opened Gist');
        insights.track('open', undefined, {
          fileCount,
          isFavorite: 0
        });
      }
    } catch (err) {
      const error: Error = err as Error;
      logger.error(`${command} > ${error && error.message}`);
      insights.exception(command, { messsage: error.message });
      if (error && error.message === 'Not Found') {
        utils.notify.error(
          `Could Not Open Gist ${gistName}`,
          `Reason: ${error.message}`
        );
      } else {
        utils.notify.error('Unable To Open Gists', error.message);
      }
    }
  };

  return [command, commandFn];
};

export { openFavorite };
