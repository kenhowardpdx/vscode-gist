<a name="1.0.0-beta.0"></a>
# [1.0.0-beta.0](https://github.com/dbankier/vscode-gist/compare/v0.5.3...v1.0.0-beta.0) (2017-03-30)

This release is a precursor for future development enabling adding providers other that GitHub Gists.

### Features

* **Add File:** Add a file to existing code block ([b2e3637](https://github.com/dbankier/vscode-gist/commit/b2e3637))
* **Change Description:** Enable change description ([484b6b2](https://github.com/dbankier/vscode-gist/commit/484b6b2))
* **Create Block:** Add ability to create a code block ([7bb2738](https://github.com/dbankier/vscode-gist/commit/7bb2738))
* **Delete Block:** Allow users to delete current code block ([e79645e](https://github.com/dbankier/vscode-gist/commit/e79645e))
* **Open Favorite:** Add ability to open favorite code block ([a19e22d](https://github.com/dbankier/vscode-gist/commit/a19e22d))
* **Open in browser:** Adds ability to open current gist in browser ([f378050](https://github.com/dbankier/vscode-gist/commit/f378050))
* **Remove File:** Users can remove a file from a code block ([a7b0b78](https://github.com/dbankier/vscode-gist/commit/a7b0b78))
* **Save Files:** Save a 'CodeFile' ([c70c595](https://github.com/dbankier/vscode-gist/commit/c70c595))

### TODO

* **Select Provider:** Currently we only have Gists as a provider. We need to let the user select a provider on the first attempt to authenticate.
* **Change Provider:** The user should be able to change a provider easily.
* **Add Provider:** We'll be adding providers like Bitbucket Snippets ([#12](https://github.com/dbankier/vscode-gist/issues/12))

### Breaking Changes

* **VSCode Version**: Bump minimum required VSCode version to 1.9.0


<a name="0.5.3"></a>
## [0.5.3](https://github.com/dbankier/vscode-gist/compare/v0.5.2...v0.5.3) (2017-03-02)

### Bug Fixes

* **bug** Adjust regex to work with windows paths ([#13](https://github.com/dbankier/vscode-gist/pull/13)), closes [#6](https://github.com/dbankier/vscode-gist/issues/6)
* **bug** Fixes "Cannot read property 'url' of undefined" ([88e46c8](https://github.com/dbankier/vscode-gist/commit/88e46c83b6e2decacd28dda4becf1052bc793fb7)), closes [#11](https://github.com/dbankier/vscode-gist/issues/11)

<a name="0.5.2"></a>
## 0.5.2 (2016-05-12)



