// tslint:disable:no-any no-magic-numbers
import { window } from 'vscode';

import { deleteFile } from '../delete-file';

const deleteFileMock = jest.fn();
const errorMock = jest.fn();
const utilsMock = jest.genMockFromModule<Utils>('../../../utils');

describe('open gist', () => {
  let deleteFileFn: CommandFn;
  beforeEach(() => {
    const gists = { deleteFile: deleteFileMock };
    const insights = { exception: jest.fn() };
    const logger = { error: errorMock, info: jest.fn() };
    deleteFileFn = deleteFile(
      { gists, insights, logger } as any,
      utilsMock as any
    )[1];
    (<any>window).activeTextEditor = undefined;
    (<any>window).visibleTextEditors = [];
    (<any>utilsMock.files.extractTextDocumentDetails).mockReturnValue({
      filename: 'foo',
      id: '123'
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('what happens when errors occur', async () => {
    expect.assertions(1);

    (<any>window).activeTextEditor = { document: {} };

    (<any>utilsMock.input.prompt).mockResolvedValueOnce('DELETE');
    deleteFileMock.mockRejectedValueOnce(false);

    await deleteFileFn();
    expect(errorMock.mock.calls.length).toBe(1);
  });
  test('it deletes the open file', async () => {
    expect.assertions(1);

    (<any>window).activeTextEditor = { document: { gist: { id: '123' } } };
    (<any>utilsMock.input.prompt).mockResolvedValueOnce('DELETE');

    await deleteFileFn();

    expect(deleteFileMock).toHaveBeenCalledWith('123', 'foo');
  });
});
