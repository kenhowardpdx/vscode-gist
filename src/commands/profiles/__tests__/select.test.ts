// tslint:disable:no-any no-magic-numbers
import { commands, window } from 'vscode';

import { select } from '../select';

const utilsMock = jest.genMockFromModule<Utils>('../../../utils');
const errorMock = jest.fn();
const addMock = jest.fn();
const getAllMock = jest.fn(() => [
  { name: 'test profile', key: 'test profile key', url: 'test profile url' }
]);

const executeCommandSpy = jest.spyOn(commands, 'executeCommand');
const showQuickPickSpy = jest.spyOn(window, 'showQuickPick');

describe('select profile', () => {
  let selectFn: CommandFn;
  beforeEach(() => {
    const insights = { exception: jest.fn() };
    const logger = { error: errorMock };
    const profiles = { add: addMock, getAll: getAllMock };
    selectFn = select(
      { get: jest.fn() },
      { insights, logger, profiles } as any,
      utilsMock as any
    )[1];
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should select an existing profile', async () => {
    expect.assertions(3);

    showQuickPickSpy.mockImplementationOnce((items: any[]) => {
      const item = items[items.length - 1];

      return Promise.resolve(item);
    });

    await selectFn();

    expect(addMock).toHaveBeenCalledWith(
      'test profile',
      'test profile key',
      'test profile url',
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

    getAllMock.mockImplementationOnce(() => {
      throw new Error('error');
    });

    let error: any;
    try {
      await selectFn();
    } catch (err) {
      error = err;
    }

    expect(errorMock.mock.calls).toHaveLength(1);
    expect(error).toBeUndefined();
  });

  test('should open create profile dialog if chooses', async () => {
    expect.assertions(1);

    getAllMock.mockReturnValue([]);

    showQuickPickSpy.mockResolvedValue({ label: 'Create New Profile' });

    await selectFn();

    expect(executeCommandSpy).toBeCalledWith('extension.profile.create');
  });
});
