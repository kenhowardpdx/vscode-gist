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
var api = "https://api.github.com";

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
    return vscode.window.showInputBox({ 
      prompt: "Enter your github password. \n" +
      "Read the docs for token based authentication.", 
      password: true 
    })
  } else {
    return Promise.resolve(password_command.output.trim());
  }
}
function createGist(type) {
  var oauth = vscode.workspace.getConfiguration('gist').oauth_token;
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
  var promise = type !== ANONYMOUS && !oauth ? getCredentials() : Promise.resolve();
  return promise
    .then(function (_auth) {
      auth = _auth;
      return vscode.window.showInputBox({ prompt: "Enter the gist description." })
    })
    .then(function (description) {
      var options = {
        method: 'POST',
        uri: api + "/gists",
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
        if (oauth) {
          options.headers["Authorization"] = "token " + oauth;
        } else {
          options.auth = auth;
        }
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