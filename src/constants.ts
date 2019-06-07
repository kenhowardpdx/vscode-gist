// tslint:disable:no-magic-numbers
import { Buffer } from 'buffer';

export const EXTENSION_ID = 'kenhowardpdx.vscode-gist';
export const DEBUG = process.env.DEBUG === 'true';
export const GISTS_BASE_URL = 'https://api.github.com';
export const GISTS_PER_PAGE = 100;
export const LOGGER_LEVEL = 3;
export const TELEMETRY_COHORT_RANGE = [0, 75];
export const TELEMETRY_WRITE_KEY = Buffer.from(
  'YzgzYjU2NGMtYTdmNS00MmVjLTkxNGEtOWZiYjViYzM2NjU5',
  'base64'
).toString();
export const TMP_DIRECTORY_PREFIX = 'vscode_gist';
