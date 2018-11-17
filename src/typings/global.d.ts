interface GistFile {
  filename: string;
  language: string;
  raw_url: string;
  size: number;
  type: string;
}

interface Gist {
  createdAt: string;
  description: string;
  fileCount: number;
  files: { [x: string]: GistFile };
  id: string;
  name: string;
  public: boolean;
  updatedAt: string;
}

interface QuickPickGist {
  block: Gist;
  /**
   * A human readable string which is rendered less prominent.
   */
  description?: string;

  /**
   * A human readable string which is rendered less prominent.
   */
  detail?: string;
  /**
   * A human readable string which is rendered prominent.
   */
  label: string;

  /**
   * Optional flag indicating if this item is picked initially.
   * (Only honored when the picker allows multiple selections.)
   *
   * @see [QuickPickOptions.canPickMany](#QuickPickOptions.canPickMany)
   */
  picked?: boolean;
}
