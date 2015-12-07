# vscode-gist

> Extension for Visual Studio Code to create, open and modify gists.
They can be anonymous, private or public and can be created from a selection or full file.

![screencast](./vscode-gist-open-and-save.gif)

## Installation

Press <kbd>F1</kbd> and narrow down the list commands by typing `extension`. Pick `Extensions: Install Extension`.
Select the `Gist Extension` extension from the list

## Manual Install

**Mac & Linux**
```sh
cd $HOME/.vscode/extensions
```
**Windows**
```sh
cd %USERPROFILE%\.vscode\extensions
```

**All Platforms**
```
git clone https://github.com/dbankier/vscode-gist.git
cd vscode-gist
npm install
```


## Github Authentication

The plugin supports both username/password and token based authentication.

To generate a token use the following command:

~~~
curl -v -u USERNAME -X POST https://api.github.com/authorizations --data "{\"scopes\":[\"gist\"], \"note\": \"VSCode-Gist-Extension\"}"
~~~

Take the token value and set the following in your `User Settings`:

~~~
"gist.oauth_token": "YOUR_TOKEN"
~~~

If value is not set, you will prompted for your password.


## Usage

### Create Gists

Press <kbd>F1</kbd> and enter one fo the following:

~~~
Gist: create new PRIVATE gist
Gist: create new ANONYMOUS gist
Gist: create new PUBLIC gist
~~~

You will be prompted a gist description.

### Open/Edit Gists

Press <kbd>F1</kbd> and enter select: `Gist: open a personal gist`.

* All files associated with the gist will be opened in splits.
* Saving the gist will commit a new revision.

## Keybord Shortcut

The following are the commands that you can assign shortcuts to:

~~~
extension.privateGist"
extension.publicGist"
extension.anonymousGist"
extension.openGist
~~~

None at this stage - but you can define your own.

## Future
Other gist functions: list, view, edit, import, etc.

## License

MIT © [David Bankier @dbankier](https://github.com/dbankier)
[@davidbankier](https://twitter.com/davidbankier)