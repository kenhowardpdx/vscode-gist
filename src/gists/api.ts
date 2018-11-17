import {
  GistsGetAllResponseItem,
  GistsGetStarredResponseItem
} from '@octokit/rest';
import { env } from 'vscode';

import { GISTS_PER_PAGE } from '../constants';

import { gists } from './gists-service';

type ListResponse = GistsGetStarredResponseItem[] | GistsGetAllResponseItem[];

const formatList = (gistList: ListResponse): Gist[] =>
  gistList.map((gist) => ({
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
  }));

/**
 * Get a list of gists
 */
export const getGists = async (starred = false): Promise<Gist[]> =>
  formatList(
    (await gists[starred ? 'getStarred' : 'getAll']({
      per_page: GISTS_PER_PAGE
    })).data
  );
