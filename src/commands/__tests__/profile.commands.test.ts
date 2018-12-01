// tslint:disable:no-any no-unsafe-any no-magic-numbers
import { commands, window } from 'vscode';

import { logger } from '../../logger';
import { profiles } from '../../profiles';

const debugSpy = jest.spyOn(logger, 'debug');

const executeCommandSpy = jest.spyOn(commands, 'executeCommand');
const showQuickPickSpy = jest.spyOn(window, 'showQuickPick');
const showInformationMessageSpy = jest.spyOn(window, 'showInformationMessage');
const showInputBoxSpy = jest.spyOn(window, 'showInputBox');
const getMock = jest.fn();
const mockState: any = {
  get: getMock,
  update: jest.fn()
};

import { createProfile, selectProfile } from '../profile.commands';

const mockProfile = {
  key: '111',
  name: 'GHE',
  url: 'http://foo.bar.bas'
};

describe('Profile Commands Tests', () => {
  beforeEach(() => {
    profiles.configure({ state: mockState });
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe('#createProfile', () => {
    test('should show information message prompt', async () => {
      expect.assertions(2);

      showInformationMessageSpy.mockResolvedValue({
        isCloseAffordance: true,
        title: 'GitHub.com (common)'
      });

      await createProfile();

      expect(showInformationMessageSpy).toHaveBeenCalledTimes(1);
      expect(showInformationMessageSpy).toHaveBeenCalledWith(
        'Which GitHub Platform?',
        { modal: true },
        { title: 'GitHub.com (common)', isCloseAffordance: true },
        { title: 'GitHub Enterprise' }
      );
    });
    test('should gather information from the user', async () => {
      expect.assertions(1);

      showInformationMessageSpy.mockResolvedValue({
        title: 'GitHub Enterprise'
      });

      showInputBoxSpy.mockResolvedValueOnce('foo');
      showInputBoxSpy.mockResolvedValueOnce('bar');
      showInputBoxSpy.mockResolvedValueOnce('bat');

      await createProfile();

      expect(showInputBoxSpy).toHaveBeenCalledTimes(3);
    });
    test('should log stuff when a user exits without entering "url"', async () => {
      expect.assertions(2);

      showInformationMessageSpy.mockResolvedValue({
        title: 'GitHub Enterprise'
      });

      showInputBoxSpy.mockResolvedValueOnce(undefined);

      await createProfile();

      expect(debugSpy).toHaveBeenCalledTimes(1);
      expect(debugSpy.mock.calls[0][0]).toContain('"url"');
    });
    test('should log stuff when a user exits without entering "key"', async () => {
      expect.assertions(2);

      showInformationMessageSpy.mockResolvedValue({
        title: 'GitHub Enterprise'
      });

      showInputBoxSpy.mockResolvedValueOnce('foo');
      showInputBoxSpy.mockResolvedValueOnce(undefined);

      await createProfile();

      expect(debugSpy).toHaveBeenCalledTimes(1);
      expect(debugSpy.mock.calls[0][0]).toContain('"key"');
    });
    test('should log stuff when a user exits without entering "name"', async () => {
      expect.assertions(2);

      showInformationMessageSpy.mockResolvedValue({
        title: 'GitHub Enterprise'
      });

      showInputBoxSpy.mockResolvedValueOnce('foo');
      showInputBoxSpy.mockResolvedValueOnce('bar');
      showInputBoxSpy.mockResolvedValueOnce(undefined);

      await createProfile();

      expect(debugSpy).toHaveBeenCalledTimes(1);
      expect(debugSpy.mock.calls[0][0]).toContain('"name"');
    });
  });
  describe('#selectProfile', () => {
    test('should open quick pick to select a profile', async () => {
      expect.assertions(1);

      const getAllSpy = jest.spyOn(profiles, 'getAll');

      getAllSpy.mockReturnValue([mockProfile]);

      await selectProfile();

      expect(showQuickPickSpy.mock.calls[0].length).toBe(1);
    });
    test('should open create profile dialog if zero profiles found', async () => {
      expect.assertions(3);

      const getAllSpy = jest.spyOn(profiles, 'getAll');

      await selectProfile();

      expect(getAllSpy).toHaveBeenCalledTimes(1);
      expect(getAllSpy.mock.results[0].value).toBeUndefined();
      expect(executeCommandSpy).toBeCalledWith('extension.createProfile');
    });
    test('should open create profile dialog if chooses', async () => {
      expect.assertions(2);

      const getAllSpy = jest.spyOn(profiles, 'getAll');
      getAllSpy.mockReturnValue([mockProfile]);

      showQuickPickSpy.mockResolvedValue({ label: 'Create New Profile' });

      await selectProfile();

      expect(getAllSpy).toHaveBeenCalledTimes(1);
      expect(executeCommandSpy).toBeCalledWith('extension.createProfile');
    });
    test('should update gist access key', async () => {
      expect.assertions(1);

      const getAllSpy = jest.spyOn(profiles, 'getAll');

      getAllSpy.mockReturnValue([mockProfile]);

      getMock.mockImplementation(() => ({
        'test-profile': {
          active: true,
          key: 'foo',
          url: 'foo'
        }
      }));

      showQuickPickSpy.mockResolvedValueOnce({
        label: mockProfile.name,
        profile: mockProfile
      });

      await selectProfile();

      expect(executeCommandSpy).toHaveBeenLastCalledWith(
        'extension.updateGistAccessKey'
      );
    });
  });
});
