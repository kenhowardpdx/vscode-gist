// tslint:disable:no-any no-unsafe-any no-require-imports ordered-imports
import TelemetryReporter from 'vscode-extension-telemetry';

jest.genMockFromModule<TelemetryReporter>('vscode-extension-telemetry');
jest.mock('vscode-extension-telemetry');

const sendTelemetryEvent = jest.fn();

(TelemetryReporter as any).mockImplementation(
  (): any => ({ sendTelemetryEvent })
);

import { telemetry } from '../telemetry-service';

describe('Telemetry Service Tests', () => {
  beforeEach(() => {
    (telemetry as any).enabled = true;
  });
  afterEach(() => {
    (telemetry as any).enabled = true;
    jest.resetAllMocks();
  });
  describe('#exception', () => {
    test('should send telemetry event to app insights', () => {
      telemetry.exception('telemetry-test', { message: 'testing' });
      expect(sendTelemetryEvent).toHaveBeenCalledWith(
        'exception',
        { context: 'telemetry-test', message: 'testing' },
        {}
      );
    });
  });
  describe('#track', () => {
    test('should send telemetry event to app insights', () => {
      telemetry.track('telemetry-test', { message: 'testing' });
      expect(sendTelemetryEvent).toHaveBeenCalledWith(
        'telemetry-test',
        { message: 'testing' },
        {}
      );
    });
  });
});
