import { window } from 'vscode';

const prompt = async (
  message: string,
  defaultValue?: string
): Promise<string> => {
  try {
    const input =
      (await window.showInputBox({ prompt: message, value: defaultValue })) ||
      '';

    return input;
  } catch (err) {
    throw err;
  }
};

const format = (list: Gist[]): QuickPickGist[] =>
  list.map((item, i, j) => ({
    block: item,
    description: `${item.public ? 'PUBLIC' : 'PRIVATE'} - Files: ${
      item.fileCount
    } - Created: ${item.createdAt} - Updated: ${item.updatedAt}`,
    label: `${j.length - i}. ${item.name}`
  }));

const quickPick = async (gists: Gist[]): Promise<QuickPickGist | undefined> =>
  window.showQuickPick(format(gists));

export { prompt, quickPick };
