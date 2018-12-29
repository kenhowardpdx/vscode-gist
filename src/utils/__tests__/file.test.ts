// tslint:disable:no-any no-magic-numbers no-unsafe-any
import {
  extractTextDocumentDetails,
  filesSync,
  fileSync,
  getFileName
} from '../file';

jest.mock('path');
jest.mock('fs');

describe('File Tests', () => {
  describe('#fileSync', () => {
    test('should create a directory and store a file', () => {
      const filePath = fileSync(
        'test-token',
        'test-filename.md',
        'test-conent'
      );
      expect(filePath).toContain('test-token');
      expect(filePath).toContain('test-filename.md');
    });
  });
  describe('#filesSync', () => {
    test('should create a directory and store a file', () => {
      const filePath = filesSync('test-token', {
        'test-1-filename.md': { content: 'test-conent' },
        'test-2-filename.md': { content: 'test-conent' },
        'test-3-filename.md': { content: 'test-conent' }
      });
      expect(filePath[0]).toContain('test-token');
      expect(filePath[0]).toContain('test-1-filename.md');
      expect(filePath[1]).toContain('test-token');
      expect(filePath[1]).toContain('test-2-filename.md');
      expect(filePath[2]).toContain('test-token');
      expect(filePath[2]).toContain('test-3-filename.md');
    });
  });
  describe('#extractTextDocumentDetails', () => {
    test('should get document details', () => {
      const getText = jest.fn(() => 'mocked-content');
      const result = extractTextDocumentDetails({
        fileName:
          '/var/folders/T/vscode_gist_1111_random_string/mocked-text-document.md',
        getText
      } as any);
      expect(result).toStrictEqual({
        content: 'mocked-content',
        filename: 'mocked-text-document.md',
        id: '1111',
        language: 'unknown',
        path:
          '/var/folders/T/vscode_gist_1111_random_string/mocked-text-document.md'
      });
    });
  });
  describe('#getFileName', () => {
    test('should return the filename', () => {
      const filePath: any = {
        fileName: '/foo/bar/baz/test-file.txt'
      };

      expect(getFileName(filePath)).toStrictEqual('test-file.txt');
    });
  });
});
