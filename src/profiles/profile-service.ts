import { Memento, workspace } from 'vscode';

class ProfileService {
  public static getInstance = (): ProfileService =>
    // TODO: permanently disable the semicolon rule
    // tslint:disable-next-line:semicolon
    ProfileService.instance ? ProfileService.instance : new ProfileService();

  private static readonly instance?: ProfileService;

  private state: Memento;

  private constructor() {
    // intentionally left blank
    this.state = workspace.getConfiguration();
  }

  public add(
    name: string,
    key: string,
    url: string = 'https://api.github.com',
    active: boolean = false
  ): void {
    const p = this.getRawProfiles();
    const currentState = Object.keys(p)
      .map((profile) => ({
        [profile]: { key: p[profile].key, url: p[profile].url, active: false }
      }))
      .reduce((prev, curr) => ({ ...prev, ...curr }), {});
    this.state.update('profiles', {
      ...currentState,
      [name]: { active, key, url }
    });
  }

  public configure(options: { state: Memento }): void {
    const { state } = options;

    this.state = state;
  }

  public get(): Profile {
    const currentProfile = this.getAll().filter((p) => p.active);

    return currentProfile[0] || undefined;
  }

  public getAll(): Profile[] {
    const p = this.getRawProfiles();

    return Object.keys(p).map((profileName) => ({
      active: p[profileName].active,
      key: p[profileName].key,
      name: profileName,
      url: p[profileName].url
    }));
  }

  public reset(): void {
    this.state.update('profiles', undefined);
  }

  private getRawProfiles(): { [x: string]: RawProfile } {
    return this.state.get<{}>('profiles', {});
  }
}

export const profiles = ProfileService.getInstance();
