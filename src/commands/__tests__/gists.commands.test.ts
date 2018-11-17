// tslint:disable:no-any no-unsafe-any no-magic-numbers
import { window } from 'vscode';

import { openCodeBlock } from '../gists.commands';

describe('Gists Commands Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe('#openCodeBlock', () => {
    test('it opens the quickpick pane', async () => {
      expect.assertions(2);

      await openCodeBlock();
      expect((window.showQuickPick as any).mock.calls.length).toBe(1);
      expect((window.showQuickPick as any).mock.calls[0]).toStrictEqual('foo');
    });
  });
});
