// tslint:disable:no-any no-magic-numbers no-unsafe-any
import * as Octokit from '@octokit/rest';
const gistsResponseData = [
  {
    created_at: new Date().toString(),
    description: 'gist one',
    files: {
      'one.md': {
        filename: 'one.md',
        language: 'markdown',
        raw_url: 'https://foo.bar/api/test123/1',
        size: '11111',
        type: 'text'
      },
      'two.md': {
        filename: 'two.md',
        language: 'markdown',
        raw_url: 'https://foo.bar/api/test123/2',
        size: '22222',
        type: 'text'
      }
    },
    id: 'test123',
    updated_at: new Date().toString()
  },
  {
    created_at: new Date().toString(),
    description: 'gist two',
    files: {
      'one.md': {
        filename: 'one.md',
        language: 'markdown',
        raw_url: 'https://foo.bar/api/test123/1',
        size: '11111',
        type: 'text'
      },
      'two.md': {
        filename: 'two.md',
        language: 'markdown',
        raw_url: 'https://foo.bar/api/test123/2',
        size: '22222',
        type: 'text'
      }
    },
    id: 'test123',
    updated_at: new Date().toString()
  }
];

const edit = jest.fn((options) =>
  Promise.resolve({
    data: {
      ...gistsResponseData[0],
      files: {
        ...gistsResponseData[0].files,
        ...options.files
      },
      id: options.gist_id || gistsResponseData[0].id
    }
  })
);
const get = jest.fn((options) =>
  Promise.resolve({
    data: { ...gistsResponseData[0], id: options.gist_id }
  })
);
const getAll = jest.fn(() => Promise.resolve({ data: gistsResponseData }));
const getStarred = jest.fn(() => Promise.resolve({ data: gistsResponseData }));
jest.genMockFromModule('@octokit/rest');
jest.mock('@octokit/rest');
(Octokit as any).mockImplementation(
  (): any => ({ gists: { edit, get, getAll, getStarred } })
);

import { getGist, getGists, updateGist } from '../api';

describe('Gists API Tests', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  describe('#getGists', () => {
    test('handles error appropriately', async () => {
      expect.assertions(1);

      getAll.mockRejectedValueOnce(new Error('Not Found'));

      try {
        await getGists();
      } catch (err) {
        expect(err).toStrictEqual(new Error('Not Found'));
      }
    });
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
    test('handles error appropriately', async () => {
      expect.assertions(1);

      edit.mockRejectedValueOnce(new Error('Not Found'));

      try {
        await updateGist('1', '2', '3');
      } catch (err) {
        expect(err).toStrictEqual(new Error('Not Found'));
      }
    });
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
});
