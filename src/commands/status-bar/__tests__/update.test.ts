// tslint:disable:no-any no-magic-numbers
import { window } from 'vscode';

import { update } from '../update';

const createStatusBarItem = jest.spyOn(window, 'createStatusBarItem');
const createStatusBarItemMock = {
  command: '',
  show: jest.fn(),
  text: ''
};

const utilsMock = jest.genMockFromModule<Utils>('../../../utils');
const debugMock = jest.fn();
const errorMock = jest.fn();
const getMock = jest.fn(() => ({ name: 'foo' }));

createStatusBarItem.mockImplementation(() => createStatusBarItemMock as any);

describe('update status bar', () => {
  let updateFn: CommandFn;
  beforeEach(() => {
    const profiles = { get: getMock };
    const insights = { exception: jest.fn() };
    const logger = { debug: debugMock, error: errorMock };
    updateFn = update({ insights, logger, profiles } as any, utilsMock)[1];
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should update the status bar', () => {
    expect.assertions(2);

    updateFn();

    expect(createStatusBarItemMock.text).toStrictEqual('GIST [foo]');
    expect(createStatusBarItemMock.command).toStrictEqual(
      'extension.profile.select'
    );
  });

  test('should show "Create Profile" in status bar', () => {
    expect.assertions(2);

    getMock.mockReturnValueOnce(undefined);

    updateFn();

    expect(createStatusBarItemMock.text).toStrictEqual('GIST [Create Profile]');
    expect(createStatusBarItemMock.command).toStrictEqual(
      'extension.profile.create'
    );
  });
});
