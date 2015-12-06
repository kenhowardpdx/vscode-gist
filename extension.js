var vscode = require('vscode');
var commands = require("./commands");
var Gist = require("./api/gist");

function activate(context) {
  context.subscriptions.push(vscode.commands.registerCommand('extension.privateGist', commands.createGist.bind(undefined, Gist.PRIVATE)));
  context.subscriptions.push(vscode.commands.registerCommand('extension.publicGist', commands.createGist.bind(undefined, Gist.PUBLIC)));
  context.subscriptions.push(vscode.commands.registerCommand('extension.anonymousGist', commands.createGist.bind(undefined, Gist.ANONYMOUS)));
}

exports.activate = activate;