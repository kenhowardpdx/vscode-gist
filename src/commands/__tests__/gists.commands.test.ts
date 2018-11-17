// tslint:disable:no-any no-unsafe-any no-magic-numbers
import { window } from 'vscode';

import { openCodeBlock } from '../gists.commands';

describe('Gists Commands Tests', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  describe('#openCodeBlock', () => {
    test('it opens the quickpick pane', async () => {
      expect.assertions(3);

      const mock: jest.MockInstance<
        typeof window.showQuickPick
      > = window.showQuickPick as any;

      await openCodeBlock();

      expect(mock.mock.calls.length).toBe(1);

      const firstGist = mock.mock.calls[0][0][0];
      const secondGist = mock.mock.calls[0][0][1];

      expect(firstGist.label).toBe('2. gist one');
      expect(secondGist.label).toBe('1. gist two');
    });
  });
});
