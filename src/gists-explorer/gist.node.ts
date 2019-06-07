import { TreeItem, Uri } from 'vscode';

class GistNode extends TreeItem {
  public files?: string[];
  public readonly gistId: string;
  public readonly label?: string;
  public readonly resource: Uri;
  public constructor(resource: Uri, gistId: string, label?: string) {
    super(resource);
    this.gistId = gistId;
    this.label = label;
    this.resource = resource;
  }
}

export { GistNode };
