var vscode = require('vscode');
var Gist = require("./api/gist");

function activate(context) {
  context.subscriptions.push(vscode.commands.registerCommand('extension.privateGist', Gist.createGist.bind(undefined, Gist.PRIVATE)));
  context.subscriptions.push(vscode.commands.registerCommand('extension.publicGist', Gist.createGist.bind(undefined, Gist.PUBLIC)));
  context.subscriptions.push(vscode.commands.registerCommand('extension.anonymousGist', Gist.createGist.bind(undefined, Gist.ANONYMOUS)));
}

exports.activate = activate;