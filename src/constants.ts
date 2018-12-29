// tslint:disable:no-magic-numbers
import { Buffer } from 'buffer';

export const EXTENSION_ID = 'kenhowardpdx.vscode-gist';
export const DEBUG = process.env.DEBUG === 'true';
export const GISTS_BASE_URL = 'https://api.github.com';
export const GISTS_PER_PAGE = 9999;
export const LOGGER_LEVEL = 3;
export const TELEMETRY_COHORT_RANGE = [0, 75];
export const TELEMETRY_WRITE_KEY = Buffer.from(
  'OTgzNDBjN2UtOTExOS00OGM3LWI2OWMtOTY3NTE3MTZiOTg4',
  'base64'
).toString();
export const TMP_DIRECTORY_PREFIX = 'vscode_gist';
