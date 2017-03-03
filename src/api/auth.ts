import vscode = require('vscode');
import * as shell from 'shelljs';


function getUser() {
  var user_command = shell.exec("git config --get github.user");
  if (user_command.code !== 0 || !user_command.stdout.trim()) {
    return vscode.window.showInputBox({ prompt: "Enter your github username" })
  } else {
    return Promise.resolve(user_command.stdout.trim());
  }
}
function getPass() {
  var password_command = shell.exec("git config --get github.password")
  if (password_command.code !== 0 || !password_command.stdout.trim()) {
    return vscode.window.showInputBox({
      prompt: "Enter your github password. \n" +
      "Read the docs for token based authentication.",
      password: true
    })
  } else {
    return Promise.resolve(password_command.stdout.trim());
  }
}

export function getCredentials() {
  if (!shell.which('git')) {
    return vscode.window.showErrorMessage("Sorry, git must be installed.");
  }
  var user
  return getUser().then( u => {
    user = u;
    return getPass()
  })
  .then(p =>
      Promise.resolve({
        user: user,
        pass: p,
        sendImmediately: true
      })
    )
}

export function getToken() {
  return vscode.workspace.getConfiguration('gist').get("oauth_token");
}

