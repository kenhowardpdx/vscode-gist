interface GistService {
  configure(options: { key: string; url: string }): void;
  createGist(
    files: { [x: string]: { content: string } },
    description?: string,
    isPublic = true
  ): Promise<Gist>;
  getGist(id: string): Promise<Gist>;
  getGists(starred?: boolean): Promise<Gist[]>;
  updateGist(id: string, filename: string, content: string): Promise<Gist>;
}
