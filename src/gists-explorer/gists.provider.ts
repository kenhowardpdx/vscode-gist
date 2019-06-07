import {
  CancellationToken,
  Event,
  EventEmitter,
  ProviderResult,
  TextDocumentContentProvider,
  TreeDataProvider,
  TreeItemCollapsibleState,
  Uri
} from 'vscode';

import { logger } from '../logger';

import { GistNode } from './gist.node';

// const getFileNodes = (_gist: GistNode): GistNode[] =>
//   // tslint:disable-next-line:no-any
//   [{ isFile: true, label: 'sample.txt', resource: {} as any }];

// const getGistNodes = (): GistNode[] =>
//   // tslint:disable-next-line:no-any
//   [{ isFile: false, label: 'sample gist', resource: {} as any }];

class GistsProvider
  implements TreeDataProvider<GistNode>, TextDocumentContentProvider {
  public readonly _onDidChangeTreeData: EventEmitter<
    GistNode
  > = new EventEmitter<GistNode>();
  public readonly onDidChangeTreeData: Event<GistNode> = this
    ._onDidChangeTreeData.event;

  private gistService: GistService;

  public constructor(gistService: GistService) {
    this.gistService = gistService;
  }

  public async getChildren(element?: GistNode): Promise<GistNode[]> {
    if (element && element.contextValue === 'gist') {
      if (element.files) {
        return element.files.map((fileName: string): GistNode => {
            const gistNode = new GistNode(Uri.parse(`${element.resource.fsPath}/${fileName}`), element.gistId);

            gistNode.contextValue = 'file';

            return gistNode;
        });
      } else {
        logger.error('No files');
        throw new Error('No files');
      }
    }

    return (await this.gistService.getGists()).map((gist) => {
      const gistNode = new GistNode(Uri.parse(gist.url), gist.id, gist.name);
      const files = Object.keys(gist.files);

      gistNode.collapsibleState = TreeItemCollapsibleState.Collapsed;

      gistNode.contextValue = 'gist';
      gistNode.files = files;

      return gistNode;
    });
  }
  public getTreeItem = (element: GistNode): GistNode => {
    if (element.contextValue === 'file') {
      element.command = {
        arguments: [element.resource],
        command: 'gistsExplorer.editFile',
        title: 'Edit Gist File'
      };
    }

    return element;
  }
  public provideTextDocumentContent(
    _uri: Uri,
    _token: CancellationToken
  ): ProviderResult<string> {
    if (!this) { throw new Error(); }

    return Promise.resolve('foo');
  }

  public refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

export { GistsProvider };
