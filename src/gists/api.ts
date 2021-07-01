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
  try {
    return new Error(
      (JSON.parse(err && err.message) || { message: 'unkown' }).message
    );
  } catch (_) {
    return err;
  }
};
// tslint:enable:no-any

const formatGist = (gist: unknown): Gist => {
  if (typeof gist != 'object') {
    // TODO: consider throwing an error
    return <Gist>{};
  }
  const g = <GistResponse>gist;
  return {
    createdAt: new Intl.DateTimeFormat(env.language, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(g.created_at)),
    description: g.description,
    fileCount: Object.keys(g.files).length,
    files: g.files,
    id: g.id,
    name: g.description || Object.keys(g.files)[0],
    public: g.public,
    updatedAt: new Intl.DateTimeFormat(env.language, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(g.updated_at)),
    url: g.html_url
  };
};

const formatGists = (gistList: GistsResponse): Gist[] =>
  gistList.map(formatGist);

const getGist = async (id: string): Promise<Gist> => {
  try {
    const results = await gists.get({ gist_id: id });

    return formatGist(results.data);
  } catch (err) {
    throw prepareError(err as Error);
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
    throw prepareError(err as Error);
  }
};

const updateGist = async (
  id: string,
  filename: string,
  content: string | null
): Promise<Gist> => {
  try {
    if (!content) {
      content = ' ';
    }
    const results = await gists.update({
      files: { [filename]: { content } },
      gist_id: id
    });

    return formatGist(results.data);
  } catch (err) {
    throw prepareError(err as Error);
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
    throw prepareError(err as Error);
  }
};

const deleteGist = async (id: string): Promise<void> => {
  try {
    await gists.delete({ gist_id: id });
  } catch (err) {
    throw prepareError(err as Error);
  }
};

const deleteFile = async (id: string, filename: string): Promise<void> => {
  try {
    await gists.update({
      // tslint:disable-next-line:no-null-keyword
      files: { [filename]: { content: '' } },
      gist_id: id
    });
  } catch (err) {
    throw prepareError(err as Error);
  }
};

export {
  configure,
  createGist,
  deleteFile,
  deleteGist,
  getGist,
  getGists,
  updateGist
};
