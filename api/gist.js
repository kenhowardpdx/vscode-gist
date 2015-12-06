var vscode = require('vscode');
var Promise = require('bluebird');
var request = Promise.promisify(require("request"));
var open = require('open');
var window = vscode.window;
var path = require("path");
var auth = require("./auth");
var api = "https://api.github.com";

exports.PRIVATE = 0;
exports.PUBLIC = 1;
exports.ANONYMOUS = 2;

function send(method, path, auth_type, body) {
  var oauth = auth.getToken();
  var promise = auth_type !== exports.ANONYMOUS && !oauth ? auth.getCredentials() : Promise.resolve();
  return promise.then(function (creds) {
      console.log(creds);
      var options = {
        method: method,
        uri: api + path,
        json: true,
        headers: {
          "User-Agent": "VSCode-Gist-Extention"
        },
        body: body
      };
      if (auth_type !== exports.ANONYMOUS) {
        if (oauth) {
          options.headers["Authorization"] = "token " + oauth;
        } else {
          options.auth = creds;
        }
      }
      return request(options);
    })
}

exports.createGist = function createGist(type) {
  var editor = vscode.window.activeTextEditor;
  if (!editor) {
    return vscode.window.showErrorMessage("First open a file");
  }
  var selection = editor.selection;
  var text_content = editor.document.getText(selection.isEmpty ? undefined : selection);
  return vscode.window.showInputBox({ prompt: "Enter the gist description." })
    .then(function (description) {
      var body = {
        description: description,
        public: type !== exports.PRIVATE,
        files: {}
      }
      body.files[path.basename(editor.document.fileName || "untitled.txt")] = {
        content: text_content
      }
      return send("POST", "/gists", type, body);
    })
    .then(function (res) {
      var page = res.body.html_url
      if (!page) {
        return vscode.window.showErrorMessage(res.body && res.body.message ? res.body.message : "Could not create gist");
      }
      open(page);
    })
}

