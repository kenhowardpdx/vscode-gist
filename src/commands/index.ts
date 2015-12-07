import vscode = require('vscode');
import Gist = require("../api/gist");
import path = require("path");
import fs = require("fs");
var open = require('open');
var tmp = require('tmp');
var request = require("bluebird").promisify(require("request"));


export function createGist(type) {
  let editor = vscode.window.activeTextEditor;
  if (!editor) {
    return vscode.window.showErrorMessage("First open a file");
  }
  let selection = editor.selection;
  let text_content = editor.document.getText(selection.isEmpty ? undefined : selection);
  return vscode.window.showInputBox({ prompt: "Enter the gist description." })
    .then(description => Gist.create( type, description, path.basename(editor.document.fileName || "untitled.txt"), text_content ))
    .then(function (res) {
      let page = res.body.html_url
      if (!page) {
        return vscode.window.showErrorMessage(res.body && res.body.message ? res.body.message : "Could not create gist");
      }
      open(page);
    })
};

function openGistFile(dir, filename, content) {
  var root = new vscode.Position(0, 0);
  var raw;
  var file = path.join(dir, filename);
  fs.writeFileSync(file, content);
  return vscode.workspace.openTextDocument(file)
  .then((doc:vscode.TextDocument) => vscode.window.showTextDocument(doc) );
}

function openFromList(list_promise, tmp_dir_prefix) {
  let gists;

  return list_promise
  .then(res => {
    gists = res.body;
    return vscode.window.showQuickPick(gists.map(a => a.description ))
  })
  .then(description => {
    return Gist.get(gists.find(a => a.description === description).url);
  })
  .then(res => {
    var selected = res.body;
    var tmpdir = tmp.dirSync({ prefix: tmp_dir_prefix + selected.id + "_" });
    var promise;
    if(vscode.window.activeTextEditor) {
      promise = vscode.commands.executeCommand("workbench.action.closeOtherEditors");
    } else  {
      promise = Promise.resolve();
    }
    Object.keys(selected.files).forEach((file, idx) => {
      if (idx > 0) {
        promise = promise
        .then(() => vscode.commands.executeCommand("workbench.action.focusLeftEditor"))
        .then(() => vscode.commands.executeCommand("workbench.action.splitEditor"))
      }
      promise = promise.then(() =>openGistFile(tmpdir.name, file, selected.files[file].content))
    })
    return promise;
  });
}

export function openGist() {
  return openFromList(Gist.list(), 'vscode_gist_');
}

export function openStarredGist() {
  return openFromList(Gist.listStarred(), 'vscode_starredgist_');
}

export function onSave(doc:vscode.TextDocument) {
    var sep = path.sep;
    var regexp = new RegExp(".*vscode_gist_([^_]*)_[^" +sep+ "]*" + sep + "(.*)");
    var matches = doc.fileName.match(regexp);
    if (matches) {
      var id = matches[1];
      var filename = matches[2];
      var files = {};
      files[filename] = {
        content: doc.getText()
      };
      return Gist.edit(id, undefined,files)
      .then(() => vscode.window.showInformationMessage("Gist files saved."))
    }
  }
