// tslint:disable:no-any no-magic-numbers no-unsafe-any
import { Levels, logger } from '../';

describe('Logger tests', () => {
  describe('Debug Level', () => {
    let debugLogger: any;

    beforeEach(() => {
      debugLogger = logger;
      debugLogger.setLevel(Levels.DEBUG);
      jest.resetAllMocks();
    });
    test('#debug', () => {
      expect.assertions(2);

      const debugSpy = jest.spyOn(global.console, 'log');

      debugLogger.debug('foo on the debug');

      expect(debugSpy.mock.calls.length).toBe(1);
      expect(debugSpy.mock.calls[0]).toStrictEqual([
        'vscode-gist>debug:',
        'foo on the debug'
      ]);
    });
    test('#error', () => {
      expect.assertions(2);

      const errorSpy = jest.spyOn(global.console, 'error');

      debugLogger.error('foo on the error');

      expect(errorSpy.mock.calls.length).toBe(1);
      expect(errorSpy.mock.calls[0]).toStrictEqual([
        'vscode-gist>error:',
        'foo on the error'
      ]);
    });
    test('#info', () => {
      expect.assertions(2);

      const infoSpy = jest.spyOn(global.console, 'info');

      debugLogger.info('foo on the info');

      expect(infoSpy.mock.calls.length).toBe(1);
      expect(infoSpy.mock.calls[0]).toStrictEqual([
        'vscode-gist>info:',
        'foo on the info'
      ]);
    });
    test('#warn', () => {
      expect.assertions(2);

      const warnSpy = jest.spyOn(global.console, 'warn');

      debugLogger.warn('foo on the warn');

      expect(warnSpy.mock.calls.length).toBe(1);
      expect(warnSpy.mock.calls[0]).toStrictEqual([
        'vscode-gist>warn:',
        'foo on the warn'
      ]);
    });
  });
  describe('Info Level', () => {
    let infoLogger: any;
    beforeEach(() => {
      infoLogger = logger;
      infoLogger.setLevel(Levels.INFO);
      jest.resetAllMocks();
    });
    test('#debug', () => {
      expect.assertions(1);

      const debugSpy = jest.spyOn(global.console, 'debug');

      infoLogger.debug('foo on the debug');

      expect(debugSpy.mock.calls.length).toBe(0);
    });
    test('#info', () => {
      expect.assertions(1);

      const infoSpy = jest.spyOn(global.console, 'info');

      infoLogger.info('foo on the info');

      expect(infoSpy.mock.calls.length).toBe(1);
    });
    test('#warn', () => {
      expect.assertions(1);

      const warnSpy = jest.spyOn(global.console, 'warn');

      infoLogger.warn('foo on the warn');

      expect(warnSpy.mock.calls.length).toBe(1);
    });
    test('#error', () => {
      expect.assertions(1);

      const errorSpy = jest.spyOn(global.console, 'error');

      infoLogger.error('foo on the error');

      expect(errorSpy.mock.calls.length).toBe(1);
    });
  });
  describe('Warn Level', () => {
    let warnLogger: any;
    beforeEach(() => {
      warnLogger = logger;
      warnLogger.setLevel(Levels.WARN);
      jest.resetAllMocks();
    });
    test('#debug', () => {
      expect.assertions(1);

      const debugSpy = jest.spyOn(global.console, 'debug');

      warnLogger.debug('foo on the debug');

      expect(debugSpy.mock.calls.length).toBe(0);
    });
    test('#info', () => {
      expect.assertions(1);

      const infoSpy = jest.spyOn(global.console, 'info');

      warnLogger.info('foo on the info');

      expect(infoSpy.mock.calls.length).toBe(0);
    });
    test('#warn', () => {
      expect.assertions(1);

      const warnSpy = jest.spyOn(global.console, 'warn');

      warnLogger.warn('foo on the warn');

      expect(warnSpy.mock.calls.length).toBe(1);
    });
    test('#error', () => {
      expect.assertions(1);

      const errorSpy = jest.spyOn(global.console, 'error');

      warnLogger.error('foo on the error');

      expect(errorSpy.mock.calls.length).toBe(1);
    });
    describe('Error Level', () => {
      let errorLogger: any;
      beforeEach(() => {
        errorLogger = logger;
        errorLogger.setLevel(Levels.ERROR);
        jest.resetAllMocks();
      });
      test('#debug', () => {
        expect.assertions(1);

        const debugSpy = jest.spyOn(global.console, 'debug');

        errorLogger.debug('foo on the debug');

        expect(debugSpy.mock.calls.length).toBe(0);
      });
      test('#info', () => {
        expect.assertions(1);

        const infoSpy = jest.spyOn(global.console, 'info');

        errorLogger.info('foo on the info');

        expect(infoSpy.mock.calls.length).toBe(0);
      });
      test('#warn', () => {
        expect.assertions(1);

        const warnSpy = jest.spyOn(global.console, 'warn');

        errorLogger.warn('foo on the warn');

        expect(warnSpy.mock.calls.length).toBe(0);
      });
      test('#error', () => {
        expect.assertions(1);

        const errorSpy = jest.spyOn(global.console, 'error');

        errorLogger.error('foo on the error');

        expect(errorSpy.mock.calls.length).toBe(1);
      });
    });
  });
});
