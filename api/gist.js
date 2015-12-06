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

exports.list = function() { return send("GET", "/gists") };
exports.listUser = function(user) { return send("GET", "/users/"+user+"/gists") };
exports.listStarred = function() { return send("GET", "/gists/starred") };
exports.listPublic = function() { return send("GET", "/gists/public") };

exports.get = function(id) { return send("GET", "/gist/"+id)};
exports.remove = function(id) { return send("DELETE", "/gist/"+id)};
exports.getRevision = function(id, sha) { return send("GET", "/gist/"+id +"/" + sha)};
exports.getCommits = function(id) {return send("GET", "gists/" + id + "/commits")};

exports.edit = function(id, file_name, description, files) {
  return send("PATCH", "/gists/" + id, undefined, {
    file_name: file_name,
    description: description,
    files: files
  });
};

exports.star = function(id) { return send("PUT", "/gist/"+id+ "/star")};
exports.unstar = function(id) { return send("DELETE", "/gist/"+id+ "/star")};
exports.isStarred = function(id) { return send("GET", "/gist/"+id+ "/star")};

exports.fork = function(id) { return send("POST", "/gist/"+id+ "/forks")};
exports.listForks = function(id) { return send("GET", "/gist/"+id+ "/forks")};
