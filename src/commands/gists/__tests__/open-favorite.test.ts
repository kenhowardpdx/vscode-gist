// tslint:disable:no-any no-magic-numbers
import { commands, window } from 'vscode';

import { openFavorite } from '../open-favorite';

jest.mock('fs');
jest.mock('path');

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
const getGistMock = jest.fn((id: string) => ({
  createdAt: new Date(),
  description: 'some markdown file',
  fileCount: 1,
  files: { 'file-one.md': { content: 'test' } },
  id,
  name: 'test',
  public: true,
  updatedAt: new Date()
}));
const utilsMock = jest.genMockFromModule<Utils>('../../../utils');
const errorMock = jest.fn();

const showQuickPickSpy = jest.spyOn(window, 'showQuickPick');
const executeCommandSpy = jest.spyOn(commands, 'executeCommand');

describe('open favorite gist', () => {
  let openFavoriteFn: CommandFn;
  beforeEach(() => {
    const gists = { getGists: getGistsMock, getGist: getGistMock };
    const insights = { exception: jest.fn() };
    const logger = { error: errorMock, info: jest.fn() };
    openFavoriteFn = openFavorite(
      { get: jest.fn() },
      { gists, insights, logger } as any,
      utilsMock as any
    )[1];
    (<any>window).activeTextEditor = undefined;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('what happens when errors occur', async () => {
    expect.assertions(1);

    showQuickPickSpy.mockRejectedValueOnce(false);

    await openFavoriteFn();
    expect(errorMock.mock.calls.length).toBe(1);
  });
  test('it opens the quickpick pane', async () => {
    expect.assertions(3);

    await openFavoriteFn();

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

    await openFavoriteFn();

    expect(executeCommandSpy).toHaveBeenCalledWith(
      'workbench.action.keepEditor'
    );
  });
});
