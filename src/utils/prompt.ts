import { window } from 'vscode';

export const prompt = async (
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
