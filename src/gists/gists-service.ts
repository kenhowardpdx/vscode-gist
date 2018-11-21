import * as Octokit from '@octokit/rest';

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

  public configure(options: { key: string; url: string }): void {
    const config = { baseUrl: options.url };
    this.options = config || this.options;
    this.octokit = new Octokit(this.options);
    this.octokit.authenticate({ type: 'token', token: options.key });
  }

  public get(
    params: Octokit.GistsGetParams
  ): Response<Octokit.GistsGetResponse> {
    return this.octokit.gists.get({ ...params });
  }

  public list(
    params?: Octokit.GistsGetAllParams
  ): Response<Octokit.GistsGetAllResponseItem[]> {
    return this.octokit.gists.getAll({ ...params });
  }

  public listStarred(
    params?: Octokit.GistsGetStarredParams
  ): Response<Octokit.GistsGetStarredResponseItem[]> {
    return this.octokit.gists.getStarred({ ...params });
  }

  public update(
    params: Octokit.GistsEditParams
  ): Response<Octokit.GistsEditResponse> {
    return this.octokit.gists.edit(params);
  }
}

export const gists = GistsService.getInstance();
