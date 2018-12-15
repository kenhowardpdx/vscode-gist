import { env } from 'vscode';

import { GISTS_BASE_URL, GISTS_PER_PAGE } from '../constants';

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
  let httpError: Error | undefined;

  try {
    httpError = new Error(JSON.parse(err.message).message);
  } catch (exc) {
    // empty
  }

  return httpError || err;
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
  }).format(new Date(gist.updated_at)),
  url: gist.html_url
});

const formatGists = (gistList: GistsResponse): Gist[] =>
  gistList.map(formatGist);

const getGist = async (id: string): Promise<Gist> => {
  try {
    const results = await gists.get({ gist_id: id });

    return formatGist(results.data);
  } catch (err) {
    const error: Error = prepareError(err as Error);

    throw error;
  }
};

/**
 * Get a list of gists
 */
const getGists = async (starred = false): Promise<Gist[]> => {
  try {
    const results = await gists[starred ? 'listStarred' : 'list']({
      per_page: GISTS_PER_PAGE
    });

    // TODO: Octokit type definitions need updating.
    // tslint:disable-next-line:no-any
    return formatGists(results.data as any);
  } catch (err) {
    const error: Error = prepareError(err as Error);

    throw error;
  }
};

const updateGist = async (
  id: string,
  filename: string,
  content: string
): Promise<Gist> => {
  try {
    const results = await gists.update({
      files: { [filename]: { content } },
      gist_id: id
    });

    return formatGist(results.data);
  } catch (err) {
    const error: Error = prepareError(err as Error);

    throw error;
  }
};

const configure = (options: { key: string; url: string }): void => {
  const key = options.key || '';
  const url = options.url || GISTS_BASE_URL;
  gists.configure({ key, url });
};

const createGist = async (
  files: { [x: string]: { content: string } },
  description?: string,
  isPublic = true
): Promise<Gist> => {
  try {
    const results = await gists.create({
      description,
      files,
      public: isPublic
    });

    return formatGist(results.data);
  } catch (err) {
    const error: Error = prepareError(err as Error);

    throw error;
  }
};

const deleteGist = async (id: string): Promise<void> => {
  try {
    await gists.delete({ gist_id: id });
  } catch (err) {
    const error: Error = prepareError(err as Error);

    throw error;
  }
};

export { configure, createGist, deleteGist, getGist, getGists, updateGist };
