import github = require('github');
import { Memento } from 'vscode';
import { StorageService } from './storage.service';

export class GistService implements StorageService {
  name = 'github';
  gh: github;

  constructor(private _store: Memento, debug = false, private _tokenKey: string = 'gisttoken') {
    this.gh = new github({ debug, headers: { 'user-agent': 'VSCode-Gist-Extension' } });
    this._getToken();
  }

  isAuthenticated(): boolean {
    return !!(this._token);
  }

  async login(username: string, password: string) {
    await this._authenticate(username, password);
    await this._createToken();
  }

  private _authenticate(username, password): Thenable<void> {
    const auth: github.AuthBasic = { username, password, type: 'basic' };
    this.gh.authenticate(auth);
    return Promise.resolve();
  }

  private async _createToken(): Promise<void> {
    const data = (await this.gh.authorization.create({
      scopes: ['gist'],
      note: `vscode-gist extension :: ${new Date().toISOString()}`
    })).data;
    let token = data.token;
    return this.setToken(token);
  }

  private _token: string;

  private _getToken(): Thenable<string> {
    if (!this._token) {
      return this.setToken(this._store.get<string>(this._tokenKey)).then(() => this._getToken());
    }
    return Promise.resolve(this._token);
  }

  // This will eventually become private when `gist.oauth_token` is removed.
  setToken(token: string): Thenable<void> {
    this._token = token;
    if (this._token) {
      this.gh.authenticate({ type: 'token', token });
    }
    return this._store.update(this._tokenKey, token);
  }

  async list() {
    const options: github.GistsGetAllParams = {};
    const gists: any[] = (await this.gh.gists.getAll(options)).data;
    gists.forEach(g => {
      let label = g.description || `No Name: ${g.id}`;
      g.label = label;
    });
    return gists;
  }

  async getStorageBlock(url: string) {
    const id: string = url.split('/').pop();
    return this.getStorageBlockById(id);
  }

  async getStorageBlockById(id: string) {
    const gist = (await this.gh.gists.get({ id })).data;
    return gist;
  }

  async createFile(fileName: string, description: string, text: string, isPrivate: boolean = false): Promise<string> {
    const files = { [fileName]: { content: text } };
    let response = await this.gh.gists.create({ description, files: JSON.stringify(files), public: !isPrivate });
    let url = (response && response.data) ? response.data.html_url : '';
    return url;
  }

  async editFile(gistId: string, fileName: string, text: string): Promise<void> {
    const files = { [fileName]: { content: text } };
    return await this.gh.gists.edit({ id: gistId, files: JSON.stringify(files) });
  }
}