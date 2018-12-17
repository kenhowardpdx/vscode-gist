// tslint:disable:no-any no-magic-numbers no-unsafe-any

import {
  configure,
  createGist,
  deleteFile,
  deleteGist,
  getGist,
  getGists,
  updateGist
} from '../api';

describe('Gists API Tests', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  describe('#configure', () => {
    test('should not throw an error', () => {
      expect(() => configure({ key: 'foo', url: 'bar' })).not.toThrowError();
    });
  });
  describe('#getGists', () => {
    test('list without params should return one block', async () => {
      expect.assertions(2);

      const gists: any = await getGists();

      expect(gists.length).toBe(2);

      expect(gists[0].description).toBe('gist one');
    });
    test('list with starred params should return one block', async () => {
      expect.assertions(2);

      const gists: any = await getGists(true);

      expect(gists.length).toBe(2);

      expect(gists[0].description).toBe('gist one');
    });
  });
  describe('#getGist', () => {
    test('retrieves a gist by id', async () => {
      expect.assertions(2);

      const gist: any = await getGist('123abc');

      expect(gist.description).toBe('gist one');
      expect(gist.id).toBe('123abc');
    });
  });
  describe('#updateGist', () => {
    test('updates a gist', async () => {
      expect.assertions(2);

      const gist = await updateGist(
        'abc123',
        'foo-bar.md',
        'test-content-foo-bar.md'
      );

      const response: any = gist ? gist : {};

      expect(response.id).toBe('abc123');
      expect(response.files['foo-bar.md']).toStrictEqual({
        content: 'test-content-foo-bar.md'
      });
    });
  });
  describe('#createGist', () => {
    test('creates a gist', async () => {
      expect.assertions(2);

      const gist = await createGist(
        { 'file-one.txt': { content: 'test-content' } },
        'test-description',
        true
      );

      expect(typeof gist.id).toStrictEqual('string');
      expect(gist.files).toStrictEqual({
        'file-one.txt': { content: 'test-content' }
      });
    });
  });
  describe('#deleteGist', () => {
    test('deletes a gist', async () => {
      expect.assertions(1);

      let error: string | undefined;
      try {
        await deleteGist('1234');
      } catch (err) {
        error = err;
      }

      expect(error).toBeUndefined();
    });
  });
  describe('#deleteFile', () => {
    test('deletes a file', async () => {
      expect.assertions(1);

      let error: string | undefined;
      try {
        await deleteFile('1234', 'foo.txt');
      } catch (err) {
        error = err;
      }

      expect(error).toBeUndefined();
    });
  });
});
