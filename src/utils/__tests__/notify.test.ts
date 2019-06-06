// tslint:disable:no-unsafe-any
import { window } from 'vscode';

import * as notify from '../notify';

let showErrorSpy: jest.SpyInstance<typeof window.showErrorMessage>;
let showInfoSpy: jest.SpyInstance<typeof window.showInformationMessage>;

describe('Notify Tests', () => {
  beforeEach(() => {
    // tslint:disable-next-line:no-any
    showErrorSpy = jest.spyOn(window, 'showErrorMessage') as any;
    // tslint:disable-next-line:no-any
    showInfoSpy = jest.spyOn(window, 'showInformationMessage') as any;
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
