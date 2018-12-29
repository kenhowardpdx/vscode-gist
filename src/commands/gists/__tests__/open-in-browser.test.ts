// tslint:disable:no-any no-magic-numbers no-unsafe-any
import { commands, window } from 'vscode';

import { TMP_DIRECTORY_PREFIX } from '../../../constants';
import { openInBrowser } from '../open-in-browser';

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
    updatedAt: new Date(),
    url: 'gist-one-url'
  },
  {
    createdAt: new Date(),
    description: 'some markdown file',
    fileCount: 1,
    files: { 'file-two.md': { content: 'test' } },
    id: '123',
    name: 'gist two',
    public: true,
    updatedAt: new Date(),
    url: 'gist-two-url'
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
  updatedAt: new Date(),
  url: 'test-url'
}));
const utilsMock = jest.genMockFromModule<Utils>('../../../utils');
const errorMock = jest.fn();

const executeCommandSpy = jest.spyOn(commands, 'executeCommand');

describe('open favorite gist', () => {
  let openInBrowserFn: CommandFn;
  beforeEach(() => {
    const gists = { getGists: getGistsMock, getGist: getGistMock };
    const insights = { exception: jest.fn() };
    const logger = { error: errorMock, info: jest.fn() };
    openInBrowserFn = openInBrowser(
      { get: jest.fn() },
      { gists, insights, logger } as any,
      utilsMock as any
    )[1];
    (<any>window).activeTextEditor = undefined;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('that a notification is shown when no open documents', async () => {
    expect.assertions(1);

    const infoSpy = jest.spyOn(utilsMock.notify, 'info');

    await openInBrowserFn();
    expect(infoSpy.mock.calls.length).toBe(1);
  });
  test('it opens a browser', async () => {
    expect.assertions(2);

    (<any>utilsMock.files.extractTextDocumentDetails).mockImplementation(
      () => ({ id: '123456789abcdefg', url: 'test-url' })
    );

    const codeBlock = {
      fileName: `${TMP_DIRECTORY_PREFIX}_123456789abcdefg_random_string/test-file-name.md`,
      getText: jest.fn(() => 'test-file-content')
    };

    const editor = {
      document: codeBlock,
      selection: { isEmpty: true }
    };

    (<any>window).activeTextEditor = editor;

    await openInBrowserFn();

    expect(getGistMock).toHaveBeenCalledWith('123456789abcdefg');
    expect(executeCommandSpy).toHaveBeenCalledWith('vscode.open', 'test-url');
  });
});
