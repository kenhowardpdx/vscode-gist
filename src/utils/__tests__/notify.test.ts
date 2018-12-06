import { window } from 'vscode';

import * as notify from '../notify';

let showErrorSpy: jest.SpyInstance<typeof window.showErrorMessage>;
let showInfoSpy: jest.SpyInstance<
  typeof window.showInformationMessage
> = jest.spyOn(window, 'showInformationMessage');

describe('Notify Tests', () => {
  beforeEach(() => {
    showErrorSpy = jest.spyOn(window, 'showErrorMessage');
    showInfoSpy = jest.spyOn(window, 'showInformationMessage');
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe('#error', () => {
    test('should notify user of error', () => {
      expect.assertions(1);

      notify.error('Foo', 'Bar');

      expect(showErrorSpy.mock.calls[0][0]).toBe('GIST ERROR: Foo > Bar');
    });
  });
  describe('#info', () => {
    test('should notify user of info', () => {
      expect.assertions(1);

      notify.info('Foo', 'Bar');

      expect(showInfoSpy.mock.calls[0][0]).toBe('GIST: Foo > Bar');
    });
  });
});
