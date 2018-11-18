import { env } from 'vscode';

import { GISTS_PER_PAGE } from '../constants';
import { logger } from '../logger';

import { gists } from './gists-service';

interface GistFile {
  content: string;
  filename: string;
  language: string;
  raw_url: string;
  size: number;
  truncated: boolean;
  type: string;
}

interface GistResponse {
  created_at: string;
  description: string;
  files: { [x: string]: GistFile };
  html_url: string;
  id: string;
  public: boolean;
  updated_at: string;
  url: string;
}

type GistsResponse = GistResponse[];

// tslint:disable:no-any
const prepareError = (err: Error): Error => {
  const httpError: Error = JSON.parse(err.message) as Error;

  if (err instanceof Object && err.message && httpError.message) {
    return new Error(httpError.message);
  }

  return err;
};
// tslint:enable:no-any

const formatGist = (gist: GistResponse): Gist => ({
  createdAt: new Intl.DateTimeFormat(env.language, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(gist.created_at)),
  description: gist.description,
  fileCount: Object.keys(gist.files).length,
  files: gist.files,
  id: gist.id,
  name: gist.description || Object.keys(gist.files)[0],
  public: !gist.public,
  updatedAt: new Intl.DateTimeFormat(env.language, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(gist.updated_at))
});

const formatGists = (gistList: GistsResponse): Gist[] =>
  gistList.map(formatGist);

export const getGist = async (id: string): Promise<Gist | void> => {
  try {
    const results = await gists.get({ gist_id: id });

    if (!results || !results.data) {
      throw new Error('Not Found');
    }

    return formatGist(results.data);
  } catch (err) {
    const error: Error = prepareError(err as Error);
    const { message } = error;
    if (message === 'Not Found') {
      throw error;
    }
    logger.error(error && error.message);
  }
};

/**
 * Get a list of gists
 */
export const getGists = async (starred = false): Promise<Gist[] | void> => {
  try {
    const results = await gists[starred ? 'listStarred' : 'list']({
      per_page: GISTS_PER_PAGE
    });

    if (!results || !results.data) {
      throw new Error('Not Found');
    }

    // TODO: Octokit type definitions need updating.
    // tslint:disable-next-line:no-any
    return formatGists(results.data as any);
  } catch (err) {
    const error: Error = prepareError(err as Error);
    const { message } = error;
    if (message === 'Not Found') {
      throw error;
    }
    logger.error(error && error.message);
  }
};

export const updateGist = async (
  id: string,
  filename: string,
  content: string
): Promise<Gist | void> => {
  try {
    const results = await gists.update({
      files: { [filename]: content },
      gist_id: id
    });

    return formatGist(results.data);
  } catch (err) {
    const error: Error = prepareError(err as Error);

    const { message } = error;
    if (message === 'Not Found') {
      throw error;
    }
    logger.error(error && error.message);
  }
};
