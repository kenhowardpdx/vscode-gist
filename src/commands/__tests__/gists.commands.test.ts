// tslint:disable:no-any no-unsafe-any no-magic-numbers
import { commands, window } from 'vscode';

import { TMP_DIRECTORY_PREFIX } from '../../constants';
import { gists } from '../../gists/gists-service';
import { logger } from '../../logger';
import { openCodeBlock, updateCodeBlock } from '../gists.commands';

jest.mock('fs');
jest.mock('path');

const executeCommandSpy = jest.spyOn(commands, 'executeCommand');
const editSpy = jest.spyOn(gists, 'update');
const errorSpy = jest.spyOn(logger, 'error');
// const getSpy = jest.spyOn(gists, 'get');
const infoSpy = jest.spyOn(logger, 'info');
// const listSpy = jest.spyOn(gists, 'list');
const showQuickPickSpy = jest.spyOn(window, 'showQuickPick');

describe('Gists Commands Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('#openCodeBlock', () => {
    test('what happens when errors occur', async () => {
      expect.assertions(1);

      showQuickPickSpy.mockRejectedValueOnce(false);

      await openCodeBlock();
      expect(errorSpy.mock.calls.length).toBe(1);
    });
    test('it opens the quickpick pane', async () => {
      expect.assertions(3);

      await openCodeBlock();

      expect(showQuickPickSpy.mock.calls.length).toBe(1);

      const firstGist = showQuickPickSpy.mock.calls[0][0][0];
      const secondGist = showQuickPickSpy.mock.calls[0][0][1];

      expect(firstGist.label).toBe('2. gist one');
      expect(secondGist.label).toBe('1. gist two');
    });
    test('it opens a document', async () => {
      expect.assertions(1);

      showQuickPickSpy.mockResolvedValue({
        block: {
          id: '123'
        },
        label: 'foo'
      });

      await openCodeBlock();

      expect(executeCommandSpy).toHaveBeenCalledWith(
        'workbench.action.keepEditor'
      );
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
        'test-file-name.md': { content: 'test-file-content' }
      });
    });
    test('should NOT save a non-gist', async () => {
      expect.assertions(1);

      await updateCodeBlock({
        fileName: '/var/foo/bar/test-file-name.md',
        getText: jest.fn(() => 'test-file-content')
      });

      expect(infoSpy.mock.calls[0][0]).toContain('Not a Gist');
    });
    test('should handle errors', async () => {
      expect.assertions(2);

      editSpy.mockRejectedValueOnce(new Error('Not Found'));

      const codeBlock = {
        fileName: `${TMP_DIRECTORY_PREFIX}_123456789abcdefg_random_string/test-file-name.md`,
        getText: jest.fn(() => 'test-file-content')
      };

      expect(async () => updateCodeBlock(codeBlock)).not.toThrowError();

      await updateCodeBlock(codeBlock);

      expect(errorSpy).toHaveBeenCalledWith('updateCodeBlock > Not Found');
    });
  });
});
