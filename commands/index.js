var vscode = require('vscode');
var open = require('open');
var gist = require("../api/gist");
var path = require("path");

exports.createGist = function createGist(type) {
  var editor = vscode.window.activeTextEditor;
  if (!editor) {
    return vscode.window.showErrorMessage("First open a file");
  }
  var selection = editor.selection;
  var text_content = editor.document.getText(selection.isEmpty ? undefined : selection);
  return vscode.window.showInputBox({ prompt: "Enter the gist description." })
    .then(function (description) {
      return gist.create( type, description, path.basename(editor.document.fileName || "untitled.txt"), text_content );
    })
    .then(function (res) {
      var page = res.body.html_url
      if (!page) {
        return vscode.window.showErrorMessage(res.body && res.body.message ? res.body.message : "Could not create gist");
      }
      open(page);
    })
};
