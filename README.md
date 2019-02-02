# Gist Extension

[![Marketplace Version](https://vsmarketplacebadge.apphb.com/version-short/kenhowardpdx.vscode-gist.svg)](https://marketplace.visualstudio.com/items?itemName=kenhowardpdx.vscode-gist)
[![Build Status](https://travis-ci.org/kenhowardpdx/vscode-gist.svg?branch=master)](https://travis-ci.org/kenhowardpdx/vscode-gist)

[![Installs](https://vsmarketplacebadge.apphb.com/installs/kenhowardpdx.vscode-gist.svg)](https://marketplace.visualstudio.com/items?itemName=kenhowardpdx.vscode-gist) [![Coverage Status](https://coveralls.io/repos/github/kenhowardpdx/vscode-gist/badge.svg?branch=master)](https://coveralls.io/github/kenhowardpdx/vscode-gist?branch=master)

Access your GitHub Gists within Visual Studio Code. You can add, edit, and delete public and private gists.

## Installation

Press <kbd>F1</kbd> and narrow down the list commands by typing `extension`. Pick `Extensions: Install Extensions`.
Select the `Gist Extension` extension from the list.

## GitHub Profiles

_**NOTE:** You must provide a personal access token to be authenticated with GitHub or a GitHub Enterprise instance._

Press <kbd>F1</kbd> and type `select profile` to initialize the profile selector. You can add as many profiles as you would like.

![vscode-gist-profiles](./images/vscode-gist-profiles.gif)

If you are using a GitHub Enterprise account, be sure to add the appropriate API url. This extension uses the REST v3 API by GitHub. Your GHE API url should look similar to this: `http(s)://[hostname]/api/v3` [(documentation)](https://developer.github.com/enterprise/2.13/v3/#schema)

## Usage

### Create Gists

You must have a file open and active to create a gist.

Press <kbd>F1</kbd> and enter the following:

~~~
GIST: Create New Gist
~~~

You will be prompted a gist description.

### Open/Edit Gists

Press <kbd>F1</kbd> and enter one fo the following:

~~~
GIST: Open Gist
GIST: Open Favorite Gist
~~~

All files associated with the gist will be opened in group layout.

Once you have opened an **owned*** gist, saving it will commit a new revision.

\* an owned gist is one created by you, not a favorited (starred) gist.

You can also use the following commands:

~~~
GIST: Delete Gist
GIST: Delete File
GIST: Add File
GIST: Open Gist In Browser
GIST: Insert Text From Gist File
~~~

## All Commands & Keyboard Mappings

Here is a list of commands and their mapped keyboard shortcuts

| Command | Command Pallet Label | Keyboard Mapping | Notes |
|:--------|:---------------------|:-----------------|:------|
|extension.gist.open|Open Gist|ctrl+alt+o|
|extension.gist.openFavorite|Open Favorite Gist|not mapped|
|extension.gist.create|Create New Gist|not mapped|
|extension.gist.openInBrowser|Open Gist In Browser|ctrl+alt+b|
|extension.gist.delete|Delete Gist|not mapped|
|extension.gist.deleteFile|Delete File|not mapped|
|extension.gist.add|Add File|ctrl+alt+a ctrl+alt+a|
|extension.gist.insert|Insert Text From Gist File|not mapped|
|extension.profile.select|Select Profile|ctrl+alt+=|
|extension.resetState|n/a|ctrl+shift+0|Delete All Extension Memory (removes auth tokens)|

## Show Your Support

If you'd like to support Gist, please consider the following &mdash; feel free to choose more than one. &#x1F609;
- [Become a Sponsor](https://www.patreon.com/kenhowardpdx "Become a sponsor on Patreon") &mdash; see [backers](https://github.com/kenhowardpdx/vscode-gist/blob/master/BACKERS.md)
- [Donations via PayPal](https://www.paypal.me/kenhowardpdx "One-time donations via PayPal")
- [Donations via Cash App](https://cash.me/$kenhowardpdx "One-time donations via Cash App")
- [Write a Review](https://marketplace.visualstudio.com/items?itemName=kenhowardpdx.vscode-gist#review-details "Write a review")
- [Star or Fork me on GitHub](https://github.com/kenhowardpdx/vscode-gist "Star or fork me on GitHub")
- [Follow me on Twitter](https://twitter.com/kenhowardpdx "Follow me on Twitter")

## Maintainer
vscode-gist is maintained by [Ken Howard](https://github.com/kenhowardpdx).
