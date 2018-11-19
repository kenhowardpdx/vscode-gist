import { extensions } from 'vscode';
import TelemetryReporter from 'vscode-extension-telemetry';

import {
  DEBUG,
  TELEMETRY_COHORT_RANGE,
  TELEMETRY_WRITE_KEY
} from '../constants';

interface Extension {
  packageJSON: { version: string };
}

const extensionId = 'kenhowardpdx.vscode-gist';
const extension = extensions.getExtension(extensionId) as Extension;
const extensionVersion =
  (extension && extension.packageJSON && extension.packageJSON.version) || '';

const telemetryCohortMax = 100;
const telemetryCohortMin = 1;
const telemetryCohort =
  Math.floor(Math.random() * telemetryCohortMax) + telemetryCohortMin;

const enabled = ((): boolean => {
  if (DEBUG) {
    return true;
  } else if (
    telemetryCohort >= TELEMETRY_COHORT_RANGE[0] &&
    telemetryCohort <= TELEMETRY_COHORT_RANGE[1]
  ) {
    return true;
  }

  return false;
})();

class TelemetryService {
  public static getInstance = (): TelemetryService =>
    // TODO: permanently disable the semicolon rule
    // tslint:disable-next-line:semicolon
    TelemetryService.instance
      ? TelemetryService.instance
      : new TelemetryService()

  private static readonly instance?: TelemetryService;

  private readonly enabled = enabled;
  private reporter: TelemetryReporter;

  private constructor() {
    this.reporter = new TelemetryReporter(
      extensionId,
      extensionVersion,
      TELEMETRY_WRITE_KEY
    );
  }

  public configure(id: string, version: string, key: string): void {
    this.reporter = new TelemetryReporter(id, version, key);
  }

  public exception(
    context: string,
    properties?: { [x: string]: string },
    measurements?: { [x: string]: number }
  ): void {
    this.track('exception', { ...properties, context }, { ...measurements });
  }

  public track(
    eventName: string,
    properties?: { [x: string]: string },
    measurements?: { [x: string]: number }
  ): void {
    if (!this.enabled) {
      return;
    }

    this.reporter.sendTelemetryEvent(
      eventName,
      { ...properties },
      { ...measurements }
    );
  }
}

export const telemetry = TelemetryService.getInstance();
