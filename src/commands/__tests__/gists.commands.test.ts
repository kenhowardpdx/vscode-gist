// tslint:disable:no-any no-unsafe-any no-magic-numbers
import { window } from 'vscode';

import { TMP_DIRECTORY_PREFIX } from '../../constants';
import { gists } from '../../gists/gists-service';
import { openCodeBlock, updateCodeBlock } from '../gists.commands';

let editSpy: jest.SpyInstance;

describe('Gists Commands Tests', () => {
  beforeEach(() => {
    editSpy = jest.spyOn(gists, 'update');
  });
  afterEach(() => {
    editSpy.mockRestore();
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
  describe('#updateCodeBlock', () => {
    test('should save', async () => {
      expect.assertions(3);

      await updateCodeBlock({
        fileName: `${TMP_DIRECTORY_PREFIX}_123456789abcdefg_random_string/test-file-name.md`,
        getText: jest.fn(() => 'test-file-content')
      });

      expect(editSpy.mock.calls.length).toBe(1);
      expect(editSpy.mock.calls[0][0].gist_id).toBe('123456789abcdefg');
      expect(editSpy.mock.calls[0][0].files).toStrictEqual({
        'test-file-name.md': 'test-file-content'
      });
    });
  });
});
