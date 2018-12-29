// tslint:disable:no-any no-unsafe-any no-magic-numbers

import { window } from 'vscode';

import { prompt, quickPick } from '../input';

const showInputBoxSpy = jest.spyOn(window, 'showInputBox');
const showQuickPickSpy = jest.spyOn(window, 'showQuickPick');

describe('Input Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('#prompt', () => {
    test('a prompt is made', async () => {
      expect.assertions(2);

      await prompt('foo', 'bar');

      expect(showInputBoxSpy.mock.calls).toHaveLength(1);
      expect(showInputBoxSpy).toHaveBeenCalledWith({
        prompt: 'foo',
        value: 'bar'
      });
    });
  });
  describe('#quickPick', () => {
    test('should show quickpick pane', async () => {
      expect.assertions(2);

      const mockGist = {
        files: { 'file-one.txt': { content: '' } },
        id: '123',
        name: 'test gist'
      };

      await quickPick([mockGist as any]);

      expect(showQuickPickSpy).toHaveBeenCalledTimes(1);
      expect(showQuickPickSpy).toHaveBeenCalledWith([
        {
          block: mockGist,
          description: expect.any(String),
          label: '1. test gist'
        }
      ]);
    });
  });
});
