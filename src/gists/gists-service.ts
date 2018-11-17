import * as Octokit from '@octokit/rest';

type Response<T> = Promise<Octokit.Response<T>>;

const DEFAULT_OPTIONS = {
  baseUrl: 'https://api.github.com'
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

  public get(
    params: Octokit.GistsGetParams
  ): Response<Octokit.GistsGetResponse> {
    return this.octokit.gists.get({ ...params });
  }

  public getAll(
    params?: Octokit.GistsGetAllParams
  ): Response<Octokit.GistsGetAllResponseItem[]> {
    return this.octokit.gists.getAll({ ...params });
  }

  public getStarred(
    params?: Octokit.GistsGetStarredParams
  ): Response<Octokit.GistsGetStarredResponseItem[]> {
    return this.octokit.gists.getStarred({ ...params });
  }

  public reset(options?: Octokit.Options): void {
    this.options = options || this.options;
    this.octokit = new Octokit(this.options);
  }
}

export const gists = GistsService.getInstance();
