interface GistService {
  configure(options: { key: string; url: string }): void;
  createGist(
    files: { [x: string]: { content: string } },
    description?: string,
    isPublic = true
  ): Promise<Gist>;
  deleteFile(id: string, filename: string): Promise<void>;
  deleteGist(id: string): Promise<void>;
  getGist(id: string): Promise<Gist>;
  getGists(starred?: boolean): Promise<Gist[]>;
  updateGist(
    id: string,
    filename: string,
    content: string | null
  ): Promise<Gist>;
}
