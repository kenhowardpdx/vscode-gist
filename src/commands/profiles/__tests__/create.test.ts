// tslint:disable:no-any no-magic-numbers
import { commands, window } from 'vscode';

import { create } from '../create';

const utilsMock = jest.genMockFromModule<Utils>('../../../utils');
const errorMock = jest.fn();
const addMock = jest.fn();

const executeCommandSpy = jest.spyOn(commands, 'executeCommand');
const showInformationMessageSpy = jest.spyOn(window, 'showInformationMessage');

describe('create profile', () => {
  let createFn: CommandFn;
  beforeEach(() => {
    const insights = { exception: jest.fn() };
    const logger = { error: errorMock };
    const profiles = { add: addMock };
    createFn = create(
      { insights, logger, profiles } as any,
      utilsMock as any
    )[1];
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should create a new profile', async () => {
    expect.assertions(3);

    showInformationMessageSpy.mockImplementationOnce(
      (_prompt: string, _options: object, ...items: any[]) => {
        const item = items[items.length - 1];

        return Promise.resolve(item);
      }
    );
    (utilsMock.input.prompt as jest.Mock).mockResolvedValueOnce('test url');
    (utilsMock.input.prompt as jest.Mock).mockResolvedValueOnce('test key');
    (utilsMock.input.prompt as jest.Mock).mockResolvedValueOnce('test name');

    await createFn();

    expect(addMock).toHaveBeenCalledWith(
      'test name',
      'test key',
      'test url',
      true
    );
    expect(executeCommandSpy).toHaveBeenNthCalledWith(
      1,
      'extension.status.update'
    );
    expect(executeCommandSpy).toHaveBeenNthCalledWith(
      2,
      'extension.gist.updateAccessKey'
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
