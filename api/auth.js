var shell = require('shelljs');
var vscode = require('vscode');
var Promise = require('bluebird');

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

exports.getCredentials = function getCredentials() {
  if (!shell.which('git')) {
    return vscode.window.showErrorMessage("Sorry, git must be installed.");
  }
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

exports.getToken = function() {
  return vscode.workspace.getConfiguration('gist').oauth_token;
}
