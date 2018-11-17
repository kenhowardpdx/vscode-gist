// tslint:disable:no-any no-magic-numbers no-unsafe-any
import { filesSync, fileSync } from '..';

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
});
