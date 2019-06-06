// tslint:disable:no-any no-magic-numbers no-unsafe-any
import { Levels, logger } from '../';

const appendLineMock = jest.fn();

describe('Logger tests', () => {
  describe('Debug Level', () => {
    let debugLogger: any;

    beforeEach(() => {
      debugLogger = logger;
      debugLogger.setLevel(Levels.DEBUG);
      debugLogger.setOutput({ appendLine: appendLineMock });
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('#debug', () => {
      expect.assertions(2);

      debugLogger.debug('foo on the debug');

      expect(appendLineMock.mock.calls.length).toBe(1);
      expect(appendLineMock.mock.calls[0]).toMatchObject([
        'vscode-gist>debug: foo on the debug'
      ]);
    });
    test('#error', () => {
      expect.assertions(2);

      debugLogger.error('foo on the error');

      expect(appendLineMock.mock.calls.length).toBe(1);
      expect(appendLineMock.mock.calls[0]).toMatchObject([
        'vscode-gist>error: foo on the error'
      ]);
    });
    test('#info', () => {
      expect.assertions(2);

      debugLogger.info('foo on the info');

      expect(appendLineMock.mock.calls.length).toBe(1);
      expect(appendLineMock.mock.calls[0]).toMatchObject([
        'vscode-gist>info: foo on the info'
      ]);
    });
    test('#warn', () => {
      expect.assertions(2);

      debugLogger.warn('foo on the warn');

      expect(appendLineMock.mock.calls.length).toBe(1);
      expect(appendLineMock.mock.calls[0]).toMatchObject([
        'vscode-gist>warn: foo on the warn'
      ]);
    });
  });
  describe('Info Level', () => {
    let infoLogger: any;
    beforeEach(() => {
      infoLogger = logger;
      infoLogger.setLevel(Levels.INFO);
      infoLogger.setOutput({ appendLine: appendLineMock });
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('#debug', () => {
      expect.assertions(1);

      infoLogger.debug('foo on the debug');

      expect(appendLineMock.mock.calls.length).toBe(0);
    });
    test('#info', () => {
      expect.assertions(1);

      infoLogger.info('foo on the info');

      expect(appendLineMock.mock.calls.length).toBe(1);
    });
    test('#warn', () => {
      expect.assertions(1);

      infoLogger.warn('foo on the warn');

      expect(appendLineMock.mock.calls.length).toBe(1);
    });
    test('#error', () => {
      expect.assertions(1);

      infoLogger.error('foo on the error');

      expect(appendLineMock.mock.calls.length).toBe(1);
    });
  });
  describe('Warn Level', () => {
    let warnLogger: any;
    beforeEach(() => {
      warnLogger = logger;
      warnLogger.setLevel(Levels.WARN);
      warnLogger.setOutput({ appendLine: appendLineMock });
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('#debug', () => {
      expect.assertions(1);

      warnLogger.debug('foo on the debug');

      expect(appendLineMock.mock.calls.length).toBe(0);
    });
    test('#info', () => {
      expect.assertions(1);

      warnLogger.info('foo on the info');

      expect(appendLineMock.mock.calls.length).toBe(0);
    });
    test('#warn', () => {
      expect.assertions(1);

      warnLogger.warn('foo on the warn');

      expect(appendLineMock.mock.calls.length).toBe(1);
    });
    test('#error', () => {
      expect.assertions(1);

      warnLogger.error('foo on the error');

      expect(appendLineMock.mock.calls.length).toBe(1);
    });
    describe('Error Level', () => {
      let errorLogger: any;
      beforeEach(() => {
        errorLogger = logger;
        errorLogger.setLevel(Levels.ERROR);
        errorLogger.setOutput({ appendLine: appendLineMock });
      });
      afterEach(() => {
        jest.clearAllMocks();
      });
      test('#debug', () => {
        expect.assertions(1);

        errorLogger.debug('foo on the debug');

        expect(appendLineMock.mock.calls.length).toBe(0);
      });
      test('#info', () => {
        expect.assertions(1);

        errorLogger.info('foo on the info');

        expect(appendLineMock.mock.calls.length).toBe(0);
      });
      test('#warn', () => {
        expect.assertions(1);

        errorLogger.warn('foo on the warn');

        expect(appendLineMock.mock.calls.length).toBe(0);
      });
      test('#error', () => {
        expect.assertions(1);

        errorLogger.error('foo on the error');

        expect(appendLineMock.mock.calls.length).toBe(1);
      });
    });
  });
});
