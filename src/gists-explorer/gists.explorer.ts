import {
  commands,
  ExtensionContext,
  TreeView,
  Uri,
  window,
  workspace
} from 'vscode';

import { GistNode } from './gist.node';
import { GistsProvider } from './gists.provider';

class GistsExplorer {
  private gistsViewer: TreeView<GistNode>;
  private scheme = 'gists';
  private viewId = 'gistsExplorer';

  public constructor(context: ExtensionContext, gistService: GistService) {
    const treeDataProvider = new GistsProvider(gistService);
    this.gistsViewer = window.createTreeView(this.viewId, {
      treeDataProvider
    });
    context.subscriptions.push(
      workspace.registerTextDocumentContentProvider(this.scheme, treeDataProvider)
    );
    commands.registerCommand(`${this.viewId}.refresh`, () =>
      treeDataProvider.refresh()
    );
    commands.registerCommand(`${this.viewId}.revealResource`, () => this.reveal());
    commands.registerCommand(`${this.viewId}.editFile`, (resource: Uri) => { window.showInformationMessage(`Rsource: ${JSON.stringify(resource, undefined, Number('2'))}`); });
  }

  private getNode(): GistNode | undefined {
    if (window.activeTextEditor) {
      if (window.activeTextEditor.document.uri.scheme === this.scheme) {
        return {
          gistId: '',
          resource: window.activeTextEditor.document.uri
        };
      }
    }

    return undefined;
  }

  private reveal(): Thenable<void> {
    const node = this.getNode();
    if (node) {
      return this.gistsViewer.reveal(node);
    }

    return Promise.resolve();
  }
}

export { GistsExplorer };
