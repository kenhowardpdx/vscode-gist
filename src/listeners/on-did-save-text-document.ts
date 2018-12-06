import { window } from 'vscode';

import { getListener, Listeners } from './extension-listeners';

const onDidSaveTextDocument: ListenerInitializer = (
  services: Services,
  utils: Utils
): [Listener, ListenerFn] => {
  const { gists, insights, logger } = services;
  const listener = Listeners.OnDidSaveTextDocument;
  const listenerStr = getListener(listener);
  const listenerFn = async (doc: GistTextDocument): Promise<void> => {
    let file = '';
    try {
      const editor = window.activeTextEditor;
      const {
        id,
        filename,
        content,
        language
      } = utils.files.extractTextDocumentDetails(doc, editor);
      file = `"${filename}" `;
      if (id) {
        logger.info(`Saving "${filename}"`);
        await gists.updateGist(id, filename, content);
        utils.notify.info(`Saved "${filename}"`);
        insights.track('save', { language });
      } else {
        logger.info(`"${doc.fileName}" Not a Gist`);
      }
    } catch (err) {
      const error: Error = err as Error;
      logger.error(`${listenerStr} > ${error && error.message}`);
      insights.exception(listenerStr, { messsage: error.message });
      if (error && error.message === 'Not Found') {
        utils.notify.error(
          `Could Not Save ${file}`,
          `Reason: ${error.message}`
        );
      }
    }
  };

  return [listener, listenerFn];
};

export { onDidSaveTextDocument };
