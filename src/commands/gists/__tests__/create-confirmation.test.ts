// tslint:disable:no-any no-magic-numbers no-unsafe-any no-unbound-method
import { window } from 'vscode';

import { createConfirmation } from '../create-confirmation';

const gistMock = {
  createdAt: new Date(),
  description: 'test',
  fileCount: 1,
  files: { 'fileone.txt': { content: 'test' } },
  id: '123',
  name: 'test',
  public: true,
  updatedAt: new Date(),
  url: 'https://my.test.com/gisttokengoeshere'
};
const utilsMock = jest.genMockFromModule<Utils>('../../../utils');
const errorMock = jest.fn();

describe('create gist', () => {
  let createConfirmationFn: CommandFn;
  beforeEach(() => {
    const gists = { createGist: jest.fn() };
    const insights = { exception: jest.fn() };
    const logger = { error: errorMock, info: jest.fn() };
    createConfirmationFn = createConfirmation(
      { get: jest.fn() },
      { gists, insights, logger } as any,
      utilsMock as any
    )[1];
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('an information message is shown', async () => {
    expect.assertions(1);

    await createConfirmationFn(gistMock);

    expect((<any>window).showInformationMessage.mock.calls[0]).toMatchObject([
      'Gist Created',
      {
        title: 'Open in Browser'
      },
      {
        title: 'Copy Gist URL to Clipboard'
      }
    ]);
  });

  test('when something goes wrong do not throw but log', async () => {
    expect.assertions(2);

    let error: any;
    try {
      await createConfirmationFn();
    } catch (err) {
      error = err;
    }

    expect(errorMock.mock.calls).toHaveLength(1);
    expect(error).toBeUndefined();
  });
});
