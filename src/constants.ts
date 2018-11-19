// tslint:disable:no-magic-numbers
import { Buffer } from 'buffer';

export const DEBUG = process.env.DEBUG === 'true';
export const GISTS_PER_PAGE = 9999;
export const LOGGER_LEVEL = 3;
export const TELEMETRY_COHORT_RANGE = [0, 25];
export const TELEMETRY_WRITE_KEY = Buffer.from(
  'OTgzNDBjN2UtOTExOS00OGM3LWI2OWMtOTY3NTE3MTZiOTg4',
  'base64'
).toString();
export const TMP_DIRECTORY_PREFIX = 'vscode_gist';
