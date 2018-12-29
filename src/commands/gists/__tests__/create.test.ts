// tslint:disable:no-any no-magic-numbers
import { commands, window } from 'vscode';

import { TMP_DIRECTORY_PREFIX } from '../../../constants';
import { create } from '../create';

jest.mock('fs');
jest.mock('path');

const createGistMock = jest.fn(
  (
    files: { [x: string]: { content: string } },
    description: string,
    isPublic: boolean
  ) => ({
    createdAt: new Date(),
    description,
    fileCount: 1,
    files,
    id: '123',
    name: description,
    public: isPublic,
    updatedAt: new Date()
  })
);
const utilsMock = jest.genMockFromModule<Utils>('../../../utils');
const errorMock = jest.fn();

const executeCommandSpy = jest.spyOn(commands, 'executeCommand');

describe('create gist', () => {
  let createFn: CommandFn;
  beforeEach(() => {
    const gists = { createGist: createGistMock };
    const insights = { exception: jest.fn() };
    const logger = { error: errorMock };
    createFn = create(
      { get: jest.fn() },
      { gists, insights, logger } as any,
      utilsMock as any
    )[1];
    (<any>window).activeTextEditor = undefined;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should create a code block and open the files', async () => {
    expect.assertions(2);

    (utilsMock.input.prompt as jest.Mock).mockImplementation(
      (_msg: string, defaultValue: string) => Promise.resolve(defaultValue)
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

    await createFn();

    expect(editor.document.getText.mock.calls).toHaveLength(1);
    expect(executeCommandSpy.mock.calls[0][0]).toStrictEqual(
      'workbench.action.keepEditor'
    );
  });

  test('when something goes wrong do not throw but log', async () => {
    expect.assertions(2);

    let error: any;
    try {
      await createFn();
    } catch (err) {
      error = err;
    }

    expect(errorMock.mock.calls).toHaveLength(1);
    expect(error).toBeUndefined();
  });
});
