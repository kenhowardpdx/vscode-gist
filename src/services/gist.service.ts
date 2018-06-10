import github from '../modules/github';
import { Memento, env } from '../modules/vscode';
import { StorageService, StorageBlock } from './storage.service';

export class GistService implements StorageService {
  name = 'github';
  gh: github;
  get label() {
    return this.name;
  }
  description = 'gist';

  constructor(private _store: Memento, debug = false, private _tokenKey: string = 'gisttoken') {
    this.gh = new github({ headers: { 'user-agent': 'VSCode-Gist-Extension' } });
    this._getToken();
  }

  isAuthenticated(): boolean {
    return !!(this._token && this._token !== 'notauthenticated');
  }

  async login(username: string, password: string) {
    await this._authenticate(username, password);
    await this._createToken();
  }

  async logout() {
    await this.setToken();
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
    return this.setToken(data.token);
  }

  private _token: string;

  private _getToken(): Thenable<string> {
    if (!this._token) {
      let token = this._store.get<string>(this._tokenKey);
      return this.setToken(token).then(() => this._getToken());
    }
    return Promise.resolve(this._token);
  }

  // This will eventually become private when `gist.oauth_token` is removed.
  // 'notauthenticated' value indicates the user logged out of the GIST extension
  setToken(token: string = 'notauthenticated'): Promise<void> {
    this._token = token;
    this.gh.authenticate({ type: 'token', token });
    return <any>this._store.update(this._tokenKey, token);
  }

  async list(favorite = false) {
    const options: github.GistsGetAllParams = { per_page: 9999 };
    const gists: StorageBlock[] = (await (favorite ? this.gh.gists.getStarred(options) : this.gh.gists.getAll(options))).data;

    return gists.map((g, i) => {
      const label = g.description || Object.keys(g.files)[0];
      const date = new Intl.DateTimeFormat(env.language, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(g.created_at));
      const updateDate = new Intl.DateTimeFormat(env.language, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(g.updated_at));
      const descriptionParts = [
        g.public ? 'PUBLIC' : 'PRIVATE',
        `Files: ${Object.keys(g.files).length}`,
        `Created: ${date}`,
        `Updated: ${updateDate}`,
      ];
      return {
        label: `${gists.length - i}. ${label}`,
        description: descriptionParts.join(', '),
        block: g
      };
    });
  }

  async getStorageBlock(url: string) {
    const id: string = url.split('/').pop();
    return this.getStorageBlockById(id);
  }

  async getStorageBlockById(id: string) {
    const gist = (await this.gh.gists.get({ id, 'gist_id': id })).data;
    return gist;
  }

  async deleteStorageBlock(id: string) {
    try {
      await this.gh.gists.delete({ id, 'gist_id': id });
    } catch (error) {
      console.error(error);
      throw new Error('Unable to delete');
    }
  }

  async removeFileFromStorageBlock(id: string, fileName: string) {
    try {
      const files = { [fileName]: null };
      this.gh.gists.edit({ id, 'gist_id': id, files: JSON.stringify(files) });
    } catch (error) {
      console.error(error);
      throw new Error('Unable to remove file');
    }
  }

  async createFile(fileName: string, description: string, text: string, isPrivate: boolean = false) {
    const files = { [fileName]: { content: text } };
    let response = await this.gh.gists.create({ description, files: JSON.stringify(files), public: !isPrivate });
    let gist = (response && response.data) ? response.data : undefined;
    if (!gist) {
      throw new Error('Gist not created');
    }
    return gist;
  }

  async editFile(gistId: string, fileName: string, text: string): Promise<void> {
    const files = { [fileName]: { content: text } };
    return await <any>this.gh.gists.edit({ id: gistId, 'gist_id': gistId, files: JSON.stringify(files) });
  }

  async changeDescription(gistId: string, description: string): Promise<void> {
    return await <any>this.gh.gists.edit({ id: gistId, 'gist_id': gistId, description, files: JSON.stringify({}) });
  }
}
