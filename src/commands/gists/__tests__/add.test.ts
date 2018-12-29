// tslint:disable:no-any no-magic-numbers no-unsafe-any
import { window } from 'vscode';

import { add } from '../add';

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

const updateGistMock = jest.fn();
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

describe('open gist', () => {
  let addFn: CommandFn;
  beforeEach(() => {
    const gists = {
      getGist: getGistMock,
      getGists: getGistsMock,
      updateGist: updateGistMock
    };
    const insights = { exception: jest.fn() };
    const logger = { debug: jest.fn(), error: errorMock, info: jest.fn() };
    addFn = add(
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

    (<any>utilsMock.input.quickPick).mockRejectedValueOnce(false);

    await addFn();
    expect(errorMock.mock.calls.length).toBe(1);
  });
  test('it prompts for filename and opens the quickpick pane', async () => {
    expect.assertions(5);

    window.activeTextEditor = <any>{
      document: { getText: jest.fn() },
      selection: { isEmpty: true }
    };
    (<any>utilsMock.input.prompt).mockResolvedValue('test-file.txt');

    await addFn();

    expect((<any>utilsMock).input.prompt).toHaveBeenCalledTimes(1);
    expect((<any>utilsMock).input.quickPick).toHaveBeenCalledTimes(1);

    expect((<any>utilsMock.input.quickPick).mock.calls.length).toBe(1);

    const firstGist = (<any>utilsMock.input.quickPick).mock.calls[0][0][0];
    const secondGist = (<any>utilsMock.input.quickPick).mock.calls[0][0][1];

    expect(firstGist.name).toBe('gist one');
    expect(secondGist.name).toBe('gist two');
  });
  test('it adds a document to a gist', async () => {
    expect.assertions(1);

    window.activeTextEditor = <any>{
      document: { getText: jest.fn(() => 'some-text') },
      selection: { isEmpty: true }
    };
    (<any>utilsMock.input.prompt).mockResolvedValue('test-file.txt');
    (<any>utilsMock.input.quickPick).mockResolvedValue({
      block: { id: '123', filename: 'test-file.txt' }
    });

    await addFn();

    expect(updateGistMock).toHaveBeenCalledWith(
      '123',
      'test-file.txt',
      'some-text'
    );
  });
});
