import vscode = require('vscode');
import auth = require("./auth");
import * as request from 'request';

var api = "https://api.github.com";

enum Type {
  PRIVATE = 0,
  PUBLIC = 1,
  ANONYMOUS = 2,
}

function send(method: string, path: string, auth_type?: Type, body?: Object): Thenable<any> {
  var oauth = auth.getToken();
  var promise: Promise<string> = <any>(auth_type !== Type.ANONYMOUS && !oauth ? auth.getCredentials() : Promise.resolve());
  return promise.then(function(creds) {
    console.log(creds);
    var options = {
      method: method,
      uri: path.indexOf("http") === 0 ? path : api + path,
      json: true,
      headers: {
        "User-Agent": "VSCode-Gist-Extention"
      },
      auth: undefined,
      body: body
    };
    if (auth_type !== Type.ANONYMOUS) {
      if (oauth) {
        options.headers["Authorization"] = "token " + oauth;
      } else {
        options.auth = creds;
      }
    }
    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if(error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  })
}

export = {
  Type,
  create: (type: Type, description: string, file_name: string, text_content: string) => {
    var body = {
      description: description,
      public: type !== Type.PRIVATE,
      files: {}
    }
    body.files[file_name] = {
      content: text_content
    }
    return send("POST", "/gists", type, body);
  },
  list: () => send("GET", "/gists"),
  listUser: (user: string) => send("GET", "/users/" + user + "/gists"),
  listStarred: () => send("GET", "/gists/starred"),
  listPublic: () => send("GET", "/gists/public"),
  get: (url: string) => send("GET", url),
  remove: (id: string) => send("DELETE", "/gists/" + id),
  getRevision: (id: string, sha: string) => send("GET", "/gist/" + id + "/" + sha),
  getCommits: (id: string) => send("GET", "gists/" + id + "/commits"),
  edit: (id: string, description: string, files: Object) =>
    send("PATCH", "/gists/" + id, undefined, {
      description: description,
      files: files
    }),
  star: (id) => send("PUT", "/gist/" + id + "/star"),
  unstar: (id) => send("DELETE", "/gist/" + id + "/star"),
  isStarred: (id) => send("GET", "/gist/" + id + "/star"),
  fork: (id) => send("POST", "/gist/" + id + "/forks"),
  listForks: (id) => send("GET", "/gist/" + id + "/forks")
}
