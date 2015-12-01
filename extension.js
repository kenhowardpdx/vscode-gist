var vscode = require('vscode');
var shell = require('shelljs');
var Promise = require('bluebird');
var request = Promise.promisify(require("request"));
var open = require('open');
var window = vscode.window;
var path = require("path");

var PRIVATE = 0;
var PUBLIC = 1;
var ANONYMOUS = 2;

function activate(context) {
  context.subscriptions.push(vscode.commands.registerCommand('extension.privateGist', createGist.bind(undefined, PRIVATE)));
  context.subscriptions.push(vscode.commands.registerCommand('extension.publicGist', createGist.bind(undefined, PUBLIC)));
  context.subscriptions.push(vscode.commands.registerCommand('extension.anonymousGist', createGist.bind(undefined, ANONYMOUS)));
}

function getCredentials() {
  var user
  return getUser().then(function (u) {
    user = u;
    return getPass()
  })
    .then(function (p) {
      return Promise.resolve({
        user: user,
        pass: p,
        sendImmediately: true
      })
    })
}
function getUser() {
  var user_command = shell.exec("git config --get github.user")
  if (user_command.code !== 0 || !user_command.output.trim()) {
    return vscode.window.showInputBox({ prompt: "Enter your github username" })
  } else {
    return Promise.resolve(user_command.output.trim());
  }
}
function getPass() {
  var password_command = shell.exec("git config --get github.password")
  if (password_command.code !== 0 || !password_command.output.trim()) {
    return vscode.window.showInputBox({ prompt: "Enter your github password", password: true })
  } else {
    return Promise.resolve(password_command.output.trim());
  }
}
function createGist(type) {
  var auth;
  var editor = vscode.window.activeTextEditor;
  if (!editor) {
    return vscode.window.showErrorMessage("First open a file");
  }

  var selection = editor.selection;
  var text_content = editor.document.getText(selection.isEmpty ? undefined : selection);
  if (!shell.which('git')) {
    return vscode.window.showErrorMessage("Sorry, git must be installed.");
  }
  var promise = type !== ANONYMOUS ? getCredentials() : Promise.resolve();
  return promise
    .then(function (_auth) {
      auth = _auth;
      return vscode.window.showInputBox({ prompt: "Enter the gist description." })
    })
    .then(function (description) {
      var api_command = shell.exec("git config --get github.password")
      var api;
      if (api_command.code !== 0 || !api_command.output.trim()) {
        api = "https://api.github.com"
      } else {
        api = api_command.output.trim();
      }
      api += "/gists";

      var options = {
        method: 'POST',
        uri: api,
        json: true,
        headers: {
          "User-Agent": "VSCode-Gist-Extention"
        },
        body: {
          description: description,
          public: type !== PRIVATE,
          files: {}
        }
      };
      options.body.files[path.basename(editor.document.fileName || "untitled.txt")] = {
        content: text_content
      }
      if (type !== ANONYMOUS) {
        options.auth = auth;
      }
      return request(options);
    })
    .then(function (res) {
      var page = res.body.html_url
      if (!page) {
        return vscode.window.showErrorMessage(res.body && res.body.message ? res.body.message : "Could not create gist");
      }
      open(page);
    })
}
exports.activate = activate;