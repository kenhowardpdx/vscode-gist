import * as vscode from 'vscode';
import Gist from '../api/gist';
import * as path from 'path';
import * as fs from 'fs';
import open = require('open');
import * as tmp from 'tmp';


export function createGist(type) {
  let editor = vscode.window.activeTextEditor;
  if (!editor) {
    return vscode.window.showErrorMessage('First open a file');
  }
  let selection = editor.selection;
  let text_content = editor.document.getText(selection.isEmpty ? undefined : selection);
  return vscode.window.showInputBox({ prompt: 'Enter the gist description.' })
    .then(description => Gist.create(type, description, path.basename(editor.document.fileName || 'untitled.txt'), text_content))
    .then(function(res) {
      let page = res.body.html_url;
      if (!page) {
        return vscode.window.showErrorMessage(res.body && res.body.message ? res.body.message : 'Could not create gist');
      }
      open(page);
    });
};

function openGistFile(dir, filename, content) {
  let file = path.join(dir, filename);
  fs.writeFileSync(file, content);
  return vscode.workspace.openTextDocument(file)
    .then((doc: vscode.TextDocument) => vscode.window.showTextDocument(doc));
}

function openFromList(list_promise, tmp_dir_prefix) {
  let gists;

  return list_promise
    .then(res => {
      gists = res.body;
      return vscode.window.showQuickPick(gists.map(a => a.description));
    })
    .then(description => {
      if (description) {
        return Gist.get(gists.find(a => a.description === description).url)
        .then(res => {
          let selected = res.body;
          let tmpdir = tmp.dirSync({ prefix: tmp_dir_prefix + selected.id + '_' });
          let promise;
          if (vscode.window.activeTextEditor) {
            promise = vscode.commands.executeCommand('workbench.action.closeOtherEditors');
          } else {
            promise = Promise.resolve();
          }
          Object.keys(selected.files).forEach((file, idx) => {
            if (idx > 0) {
              promise = promise
                .then(() => vscode.commands.executeCommand('workbench.action.focusLeftEditor'))
                .then(() => vscode.commands.executeCommand('workbench.action.splitEditor'));
            }
            promise = promise.then(() => openGistFile(tmpdir.name, file, selected.files[file].content));
          });
          return promise;
        });
      }
    });
}

function getGistDetails(doc = (vscode.window.activeTextEditor ? vscode.window.activeTextEditor.document : undefined)) {
  if (!doc) { return undefined; }
  let sep = (path.sep === '\\') ? '\\\\' : path.sep;
  let regexp = new RegExp(`.*vscode_gist_([^_]*)_[^${sep}]*${sep}(.*)`);
  let matches = doc.fileName.match(regexp);
  if (matches) {
    return {
      path: path.dirname(matches[0]),
      id: matches[1],
      filename: matches[2],
    };
  }
}

export function openGist() {
  return openFromList(Gist.list(), 'vscode_gist_');
}

export function openStarredGist() {
  return openFromList(Gist.listStarred(), 'vscode_starredgist_');
}

export function deleteCurrentGist() {
  let curr_gist = getGistDetails();
  if (!curr_gist) {
    return vscode.window.showErrorMessage('First open a personal gist');
  }
  return Gist.remove(curr_gist.id)
  .then(() => vscode.commands.executeCommand('workbench.action.closeAllEditors'))
  .then(() =>  vscode.window.showInformationMessage('Gist removed.'));
}

export function removeFileFromGist() {
  let curr_gist = getGistDetails();
  if (!curr_gist) {
    return vscode.window.showErrorMessage('First open a personal gist');
  }
  return Gist.edit(curr_gist.id, undefined, {
      [curr_gist.filename]: null
  })
  .then(() => vscode.commands.executeCommand('workbench.files.action.closeFile'))
  .then(() => vscode.window.showInformationMessage('File removed from the gist.'));
}

export function addNewFileToGist() {
  let curr_gist = getGistDetails();
  if (!curr_gist) {
    return vscode.window.showErrorMessage('First open a personal gist');
  }

  let file_name;
  return vscode.window.showInputBox({ prompt: 'Enter new file name:' })
  .then((_name) => {
    file_name = _name;
    return vscode.commands.executeCommand('workbench.action.focusLeftEditor');
  })
  .then(() => vscode.commands.executeCommand('workbench.action.splitEditor'))
  .then(() => openGistFile(curr_gist.path, file_name, ''))
  .then(() => vscode.window.showInformationMessage('Saving the file will add it to the current gist.'));
}

export function changeGistDescription() {
  let curr_gist = getGistDetails();
  if (!curr_gist) {
    return vscode.window.showErrorMessage('First open a personal gist');
  }

  let file_name;
  return vscode.window.showInputBox({ prompt: 'Enter new description:' })
  .then((_name) => {
    file_name = _name;
   return Gist.edit(curr_gist.id, _name, undefined);
  })
  .then(() => vscode.window.showInformationMessage('Gist description updated.'));
}

export function openGistInBrowser() {
  let curr_gist = getGistDetails();
  if (!curr_gist) {
    return vscode.window.showErrorMessage('First open a personal gist');
  }
  open('https://gist.github.com/' + curr_gist.id);
}

export function onSave(doc: vscode.TextDocument) {
  let curr_gist = getGistDetails(doc);
  if (curr_gist) {
    return Gist.edit(curr_gist.id, undefined, {
      [curr_gist.filename]: {
        content: doc.getText()
      }
    })
    .then((res) => vscode.window.showInformationMessage(res.body.message || 'Gist files saved.' ));
  }
}
