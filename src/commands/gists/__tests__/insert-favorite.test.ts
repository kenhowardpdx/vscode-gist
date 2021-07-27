// tslint:disable:no-any no-magic-numbers no-unsafe-any
import { window } from 'vscode';

import { insertFavorite } from '../insert-favorite';

jest.mock('fs');
jest.mock('path');

const showQuickPickSpy = jest.spyOn(window, 'showQuickPick');

const getGistsMock = jest.fn(() => [
  {
    createdAt: new Date(),
    description: 'some markdown file',
    fileCount: 1,
    files: { 'file-one.md': { content: 'test' } },
    id: '123',
    name: 'gist one',
    public: true,
    updatedAt: new Date()
  },
  {
    createdAt: new Date(),
    description: 'some markdown file',
    fileCount: 1,
    files: { 'file-two.md': { content: 'test' } },
    id: '123',
    name: 'gist two',
    public: true,
    updatedAt: new Date()
  }
]);

const updateGistMock = jest.fn();
const getGistMock = jest.fn((id: string) => ({
  createdAt: new Date(),
  description: 'some markdown file',
  fileCount: 1,
  files: {
    'file-one.md': { content: 'test' },
    'file-two.md': { content: 'test' }
  },
  id,
  name: 'test',
  public: true,
  updatedAt: new Date()
}));
const utilsMock = jest.genMockFromModule<Utils>('../../../utils');
const errorMock = jest.fn();

describe('insert favorite gist', () => {
  let insertFavoriteFn: CommandFn;
  beforeEach(() => {
    const gists = {
      getGist: getGistMock,
      getGists: getGistsMock,
      updateGist: updateGistMock
    };
    const insights = { exception: jest.fn() };
    const logger = { debug: jest.fn(), error: errorMock, info: jest.fn() };
    insertFavoriteFn = insertFavorite(
      { get: jest.fn() },
      { gists, insights, logger } as any,
      utilsMock as any
    )[1];
    window.activeTextEditor = <any>{
      document: { getText: jest.fn() },
      selection: { isEmpty: true }
    };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should log error when no editor', async () => {
    expect.assertions(1);

    (<any>window.activeTextEditor) = undefined;

    await insertFavoriteFn();
    expect(errorMock.mock.calls.length).toBe(1);
  });
  test('what happens when errors occur', async () => {
    expect.assertions(1);

    (<any>utilsMock.input.quickPick).mockRejectedValueOnce(false);

    await insertFavoriteFn();
    expect(errorMock.mock.calls.length).toBe(1);
  });
  test('it should prompt the user to select a gist', async () => {
    expect.assertions(1);

    await insertFavoriteFn();

    expect((<any>utilsMock).input.quickPick).toHaveBeenCalledWith([
      expect.any(Object),
      expect.any(Object)
    ]);
  });
  test('it should query for the users selected gist', async () => {
    expect.assertions(1);

    (<any>utilsMock.input.quickPick).mockResolvedValueOnce({
      block: { id: '123' }
    });

    await insertFavoriteFn();

    expect(getGistMock).toHaveBeenCalledWith('123');
  });
  test('it should prompt the user to select a file if more than one is available', async () => {
    expect.assertions(1);

    (<any>utilsMock.input.quickPick).mockResolvedValueOnce({
      block: { id: '123' }
    });

    await insertFavoriteFn();

    expect(showQuickPickSpy).toHaveBeenCalledWith([
      {
        description: '',
        'file-one.md': expect.any(Object),
        label: 'file-one.md'
      },
      {
        description: '',
        'file-two.md': expect.any(Object),
        label: 'file-two.md'
      }
    ]);
  });
});
