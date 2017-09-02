import * as assert from 'assert';
import * as td from 'testdouble';

import * as vscode from '../src/modules/vscode';

const applyEdit = td.function('applyEdit');
td.replace(vscode, 'workspace', { applyEdit });
td.replace(vscode, 'Range', td.constructor());
td.replace(vscode, 'TextEdit', td.constructor());
td.replace(vscode, 'WorkspaceEdit', td.constructor(class WorkspaceEdit { set(uri: string, edits: any[]) {}}));
td.when(applyEdit(td.matchers.anything())).thenResolve(true);

import { insertText } from '../src/helpers';

suite('Helpers Tests', () => {
  suite('insertText test', () => {
    test('should apply edit to given editor', (done) => {
      const editor: any = { document: { uri: '' }, selection: { start: 0, end: 0 }};
      insertText(editor, 'foo').then(result => {
        assert.equal(result, true);
        done();
      });
    });
  });
});