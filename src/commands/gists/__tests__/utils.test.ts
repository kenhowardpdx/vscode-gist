// tslint:disable:no-any no-magic-numbers
import { window, workspace } from 'vscode';

import { openGist, selectFile } from '../utils';

const showQuickPickSpy = jest.spyOn(window, 'showQuickPick');
const showTextDocumentSpy = jest.spyOn(window, 'showTextDocument');
const openTextDocumentMock = jest.spyOn(workspace, 'openTextDocument');

jest.mock('path');
jest.mock('fs');

describe('Gist Command Utils Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('#openGist', () => {
    test('it should open a gist in an editor', async () => {
      expect.assertions(3);

      const mockDoc = {
        getText(): string {
          return 'test-file-one';
        }
      };

      openTextDocumentMock.mockImplementationOnce((_filePath: string) =>
        Promise.resolve(mockDoc)
      );

      await openGist({
        fileCount: 1,
        files: { 'file-one.md': { content: 'test-file-one' } },
        id: '123test'
      } as any);

      expect(showTextDocumentSpy).toHaveBeenCalledTimes(1);
      expect(openTextDocumentMock).toHaveBeenCalledWith(
        expect.stringContaining('file-one.md')
      );
      expect(showTextDocumentSpy).toHaveBeenCalledWith(mockDoc);
    });
  });
  describe('#selectFile', () => {
    test('it accepts a list of gist files', async () => {
      expect.assertions(1);

      await selectFile({
        files: {
          'file-one.md': { content: 'test-content' },
          'file-two.md': { content: 'test-content' }
        }
      } as any);

      expect(showQuickPickSpy).toHaveBeenCalledTimes(1);
    });
    test('it returns a single file when the user selects one', async () => {
      expect.assertions(2);
      showQuickPickSpy.mockImplementationOnce((items: any[]) =>
        Promise.resolve(items[0])
      );

      const file = await selectFile({
        files: {
          'file-one.md': { content: 'test-content-one' },
          'file-two.md': { content: 'test-content-two' }
        }
      } as any);

      expect(showQuickPickSpy).toHaveBeenCalledTimes(1);
      expect(file).toStrictEqual({
        content: 'test-content-one',
        filename: 'file-one.md'
      });
    });
  });
});
