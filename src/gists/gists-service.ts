import * as Octokit from '@octokit/rest';
import * as https from 'https';

import { GISTS_BASE_URL } from '../constants';

type Response<T> = Promise<Octokit.Response<T>>;

const DEFAULT_OPTIONS = {
  baseUrl: GISTS_BASE_URL
};

class GistsService {
  public static getInstance = (): GistsService =>
    // TODO: permanently disable the semicolon rule
    // tslint:disable-next-line:semicolon
    GistsService.instance ? GistsService.instance : new GistsService();

  private static readonly instance?: GistsService;

  private octokit: Octokit;
  private options: Octokit.Options = DEFAULT_OPTIONS;

  private constructor() {
    this.octokit = new Octokit(this.options);
  }

  public configure(options: {
    key?: string;
    rejectUnauthorized?: boolean;
    url?: string;
  }): void {
    const key = options.key || '';
    const url = options.url || 'https://api.github.com';
    const rejectUnauthorized = options.rejectUnauthorized || true;
    const agent = new https.Agent({ rejectUnauthorized });
    const config = { baseUrl: url, agent };
    this.options = config || this.options;
    this.octokit = new Octokit(this.options);
    if (key) {
      this.octokit.authenticate({ type: 'token', token: key });
    }
  }

  public create(
    params: Octokit.GistsCreateParams
  ): Response<Octokit.GistsCreateResponse> {
    return this.octokit.gists.create(params);
  }

  public delete(
    params: Octokit.GistsDeleteParams
  ): Response<Octokit.GistsDeleteResponse> {
    return this.octokit.gists.delete(params);
  }

  public get(
    params: Octokit.GistsGetParams
  ): Response<Octokit.GistsGetResponse> {
    return this.octokit.gists.get({ ...params });
  }

  public list(
    params?: Octokit.GistsListParams
  ): Response<Octokit.GistsListResponseItem[]> {
    return this.octokit.gists.list({ ...params });
  }

  public listStarred(
    params?: Octokit.GistsListStarredParams
  ): Response<Octokit.GistsListStarredResponseItem[]> {
    return this.octokit.gists.listStarred({ ...params });
  }

  // tslint:disable-next-line:no-any
  public paginate<T>(starred: boolean, filter?: (response: Octokit.Response<any>, done?: () => T) => any): Promise<T[]> {
    return this.octokit.paginate(`GET /gists${starred ? '/starred' : ''}`, undefined, filter);
  }

  public update(
    params: Octokit.GistsUpdateParams
  ): Response<Octokit.GistsUpdateResponse> {
    return this.octokit.gists.update(params);
  }
}

export const gists = GistsService.getInstance();
