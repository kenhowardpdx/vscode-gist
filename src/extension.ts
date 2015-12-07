import commands = require("./commands");
import Gist = require("./api/gist");
import vscode = require('vscode');
import path = require("path");

function activate(context) {
  context.subscriptions.push(vscode.commands.registerCommand('extension.privateGist', commands.createGist.bind(undefined, Gist.Type.PRIVATE)));
  context.subscriptions.push(vscode.commands.registerCommand('extension.publicGist', commands.createGist.bind(undefined, Gist.Type.PUBLIC)));
  context.subscriptions.push(vscode.commands.registerCommand('extension.anonymousGist', commands.createGist.bind(undefined, Gist.Type.ANONYMOUS)));
  context.subscriptions.push(vscode.commands.registerCommand('extension.openGist', commands.openGist));
  context.subscriptions.push(vscode.commands.registerCommand('extension.openStarredGist', commands.openStarredGist));
  vscode.workspace.onDidSaveTextDocument(commands.onSave)
}

exports.activate = activate;