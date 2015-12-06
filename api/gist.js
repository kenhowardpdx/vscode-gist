var vscode = require('vscode');
var Promise = require('bluebird');
var request = Promise.promisify(require("request"));
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

exports.create = function (type, description, file_name, text_content) {
  var body = {
    description: description,
    public: type !== exports.PRIVATE,
    files: {}
  }
  body.files[file_name] = {
    content: text_content
  }
  return send("POST", "/gists", type, body);
};

