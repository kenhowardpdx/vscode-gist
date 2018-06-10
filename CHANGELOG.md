<a name="1.2.1"></a>
## [1.2.1](https://github.com/kenhowardpdx/vscode-gist/compare/v1.1.5...v1.2.1) (2018-06-10)


### Bug Fixes

* **deps:** update github pkg to [@octokit](https://github.com/octokit)/rest pkg ([36e1b5a](https://github.com/kenhowardpdx/vscode-gist/commit/36e1b5a))

### Vulnerability Updates

* upgraded to latest dependencies to address vulnerability in hoek v2.16.3 ([CVE-2018-3728](https://nvd.nist.gov/vuln/detail/CVE-2018-3728), [9bc973c](https://github.com/kenhowardpdx/vscode-gist/commit/9bc973c))

### Notes

* Prevents `.vscode-test` folder from published with the extension. ([86f39ac](https://github.com/kenhowardpdx/vscode-gist/commit/86f39ac))
* Updates README.md with note on logging in with access tokens. ([27f7b67](https://github.com/kenhowardpdx/vscode-gist/commit/27f7b67))


<a name="1.2.0"></a>
# [1.2.0](https://github.com/kenhowardpdx/vscode-gist/compare/v1.1.5...v1.2.0) (2018-01-03)


### Features

* **default file threshold:** Add codeBlockFileNotificationThreshold user setting. ([233fab6](https://github.com/kenhowardpdx/vscode-gist/commit/233fab6))
* **open single:** Open a single file if block has more than 10 files ([9352558](https://github.com/kenhowardpdx/vscode-gist/commit/9352558))



<a name="1.1.5"></a>
## [1.1.5](https://github.com/kenhowardpdx/vscode-gist/compare/v1.1.4...v1.1.5) (2017-11-07)


### Bug Fixes

* **Initialization test:** return actual instance of controller. ([d14b333](https://github.com/kenhowardpdx/vscode-gist/commit/d14b333))
* **open multiple files:** keep editor open, don't split ([936a5a7](https://github.com/kenhowardpdx/vscode-gist/commit/936a5a7)), closes [#18](https://github.com/kenhowardpdx/vscode-gist/issues/18)
* **openCodeBlock:** remove condition that closes other editors  ([e9d1017](https://github.com/kenhowardpdx/vscode-gist/commit/e9d1017)), closes [#16](https://github.com/kenhowardpdx/vscode-gist/issues/16)


### Features

* **Log Out:** Added status bar "GIST" to indicate logged in status. ([93edeeb](https://github.com/kenhowardpdx/vscode-gist/commit/93edeeb)), closes [#14](https://github.com/kenhowardpdx/vscode-gist/issues/14)



<a name="1.1.4"></a>
## [1.1.4](https://github.com/kenhowardpdx/vscode-gist/compare/v1.1.3...v1.1.4) (2017-08-30)



<a name="1.1.3"></a>
## [1.1.3](https://github.com/kenhowardpdx/vscode-gist/compare/v1.1.2...v1.1.3) (2017-08-30)


### Bug Fixes

* **save:** pass doc to onSaveTextDocument ([9528eb8](https://github.com/kenhowardpdx/vscode-gist/commit/9528eb8)), closes [#9](https://github.com/kenhowardpdx/vscode-gist/issues/9)



<a name="1.1.2"></a>
## [1.1.2](https://github.com/kenhowardpdx/vscode-gist/compare/v1.1.1...v1.1.2) (2017-08-29)



<a name="1.1.1"></a>
## [1.1.1](https://github.com/kenhowardpdx/vscode-gist/compare/v1.1.0...v1.1.1) (2017-08-29)


### Features

* **Insert Text:** Add insert text feature ([96e3609](https://github.com/kenhowardpdx/vscode-gist/commit/96e3609)), closes [#5](https://github.com/kenhowardpdx/vscode-gist/issues/5)



<a name="1.0.1"></a>
## [1.0.1](https://github.com/kenhowardpdx/vscode-gist/compare/v1.0.0...v1.0.1) (2017-08-16)



<a name="1.0.0"></a>
# [1.0.0](https://github.com/kenhowardpdx/vscode-gist/compare/v1.0.0-beta.1...v1.0.0) (2017-08-16)



<a name="1.0.0-beta.1"></a>
# [1.0.0-beta.1](https://github.com/kenhowardpdx/vscode-gist/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2017-07-10)



<a name="1.0.0-beta.0"></a>
# [1.0.0-beta.0](https://github.com/kenhowardpdx/vscode-gist/compare/v0.5.3...v1.0.0-beta.0) (2017-03-30)

This release is a precursor for future development enabling adding providers other that GitHub Gists.

### Features

* **Add File:** Add a file to existing code block ([b2e3637](https://github.com/kenhowardpdx/vscode-gist/commit/b2e3637))
* **Change Description:** Enable change description ([484b6b2](https://github.com/kenhowardpdx/vscode-gist/commit/484b6b2))
* **Create Block:** Add ability to create a code block ([7bb2738](https://github.com/kenhowardpdx/vscode-gist/commit/7bb2738))
* **Delete Block:** Allow users to delete current code block ([e79645e](https://github.com/kenhowardpdx/vscode-gist/commit/e79645e))
* **Open Favorite:** Add ability to open favorite code block ([a19e22d](https://github.com/kenhowardpdx/vscode-gist/commit/a19e22d))
* **Open in browser:** Adds ability to open current gist in browser ([f378050](https://github.com/kenhowardpdx/vscode-gist/commit/f378050))
* **Remove File:** Users can remove a file from a code block ([a7b0b78](https://github.com/kenhowardpdx/vscode-gist/commit/a7b0b78))
* **Save Files:** Save a 'CodeFile' ([c70c595](https://github.com/kenhowardpdx/vscode-gist/commit/c70c595))

### TODO

* **Select Provider:** Currently we only have Gists as a provider. We need to let the user select a provider on the first attempt to authenticate.
* **Change Provider:** The user should be able to change a provider easily.
* **Add Provider:** We'll be adding providers like Bitbucket Snippets ([#12](https://github.com/kenhowardpdx/vscode-gist/issues/12))

### Breaking Changes

* **VSCode Version**: Bump minimum required VSCode version to 1.9.0


<a name="0.5.3"></a>
## [0.5.3](https://github.com/kenhowardpdx/vscode-gist/compare/v0.5.2...v0.5.3) (2017-03-02)

### Bug Fixes

* **bug** Adjust regex to work with windows paths ([#13](https://github.com/kenhowardpdx/vscode-gist/pull/13)), closes [#6](https://github.com/kenhowardpdx/vscode-gist/issues/6)
* **bug** Fixes "Cannot read property 'url' of undefined" ([88e46c8](https://github.com/kenhowardpdx/vscode-gist/commit/88e46c83b6e2decacd28dda4becf1052bc793fb7)), closes [#11](https://github.com/kenhowardpdx/vscode-gist/issues/11)

<a name="0.5.2"></a>
## 0.5.2 (2016-10-06)



