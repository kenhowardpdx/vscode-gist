import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
import * as https from 'https';

import { GISTS_BASE_URL } from '../constants';

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
  private options = DEFAULT_OPTIONS;

  private constructor() {
    this.octokit = new Octokit(this.options);
  }

  public configure(options: {
    key?: string;
    rejectUnauthorized?: boolean;
    url?: string;
  }): void {
    const url = options.url || 'https://api.github.com';
    const rejectUnauthorized = options.rejectUnauthorized || true;
    const agent = new https.Agent({ rejectUnauthorized });
    const config = { baseUrl: url, agent };
    this.options = config || this.options;
    this.octokit = new Octokit({ auth: options.key, ...this.options });
  }

  public create(
    params: RestEndpointMethodTypes['gists']['create']['parameters']
  ) {
    return this.octokit.gists.create(params);
  }

  public delete(
    params: RestEndpointMethodTypes['gists']['delete']['parameters']
  ) {
    return this.octokit.gists.delete(params);
  }

  public get(params: RestEndpointMethodTypes['gists']['get']['parameters']) {
    return this.octokit.gists.get(params);
  }

  public list(params?: RestEndpointMethodTypes['gists']['list']['parameters']) {
    return this.octokit.gists.list(params);
  }

  public listStarred(
    params?: RestEndpointMethodTypes['gists']['listStarred']['parameters']
  ) {
    return this.octokit.gists.listStarred(params);
  }

  public update(
    params: RestEndpointMethodTypes['gists']['update']['parameters']
  ) {
    return this.octokit.gists.update(params);
  }
}

export const gists = GistsService.getInstance();
