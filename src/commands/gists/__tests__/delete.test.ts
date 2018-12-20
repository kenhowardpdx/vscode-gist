// tslint:disable:no-any no-magic-numbers
import { window } from 'vscode';

import { deleteCommand } from '../delete';

const deleteGistMock = jest.fn();
const errorMock = jest.fn();
const utilsMock = jest.genMockFromModule<Utils>('../../../utils');

describe('open gist', () => {
  let deleteFn: CommandFn;
  beforeEach(() => {
    const gists = { deleteGist: deleteGistMock };
    const insights = { exception: jest.fn() };
    const logger = { error: errorMock, info: jest.fn() };
    deleteFn = deleteCommand(
      { gists, insights, logger } as any,
      utilsMock as any
    )[1];
    (<any>window).activeTextEditor = undefined;
    (<any>window).visibleTextEditors = [];
    (<any>utilsMock.files.extractTextDocumentDetails).mockReturnValue({
      id: '123'
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should log error when no editor', async () => {
    expect.assertions(1);

    (<any>window.activeTextEditor) = undefined;

    await deleteFn();
    expect(errorMock.mock.calls.length).toBe(1);
  });
  test('what happens when errors occur', async () => {
    expect.assertions(1);

    (<any>window).activeTextEditor = { document: {} };

    deleteGistMock.mockRejectedValueOnce(false);

    await deleteFn();
    expect(errorMock.mock.calls.length).toBe(1);
  });
  test('it deletes the open gist', async () => {
    expect.assertions(1);

    (<any>window).activeTextEditor = { document: { gist: { id: '123' } } };

    await deleteFn();

    expect(deleteGistMock).toHaveBeenCalledWith('123');
  });
});
