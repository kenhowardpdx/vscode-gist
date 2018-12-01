# Gist Extension

[![Marketplace Version](https://vsmarketplacebadge.apphb.com/version-short/kenhowardpdx.vscode-gist.svg)](https://marketplace.visualstudio.com/items?itemName=kenhowardpdx.vscode-gist)
[![Build Status](https://travis-ci.org/kenhowardpdx/vscode-gist.svg?branch=master)](https://travis-ci.org/kenhowardpdx/vscode-gist)

[![Installs](https://vsmarketplacebadge.apphb.com/installs/kenhowardpdx.vscode-gist.svg)](https://marketplace.visualstudio.com/items?itemName=kenhowardpdx.vscode-gist) [![Coverage Status](https://coveralls.io/repos/github/kenhowardpdx/vscode-gist/badge.svg?branch=master)](https://coveralls.io/github/kenhowardpdx/vscode-gist?branch=master)

Access your GitHub Gists within Visual Studio Code. You can add, edit, and delete public and private gists.

## Installation

Press <kbd>F1</kbd> and narrow down the list commands by typing `extension`. Pick `Extensions: Install Extensions`.
Select the `Gist Extension` extension from the list.

## GitHub Authentication

The plugin requires you authenticate with GitHub.

You can either enter a username and password or a personal access token.

### Login With Username
![login-username](./images/login-username.gif)

### Login With Access Token

Note: To access _Login With Access Token_, leave username blank and press <kbd>ENTER</kbd> or <kbd>ESCAPE</kbd> and jump to this option.

![login-access-token](./images/login-access-token.gif)

## Usage

### Create Gists

You must have a file open and active to create a gist.

Press <kbd>F1</kbd> and enter the following:

~~~
GIST: Create New Block
~~~

You will be prompted a gist description.

### Open/Edit Gists

Press <kbd>F1</kbd> and enter one fo the following:

~~~
GIST: Open Block
GIST: Open Favorite Block
~~~

All files associated with the gist will be opened in group layout.

Once you have opened an **owned*** gist, saving it will commit a new revision.

\* an owned gist is one created by you, not a favorited (starred) gist.

You can also use the following commands:

~~~
GIST: Delete Block
GIST: Remove From Block
GIST: Add To Block
GIST: Change Block Description
GIST: Open Block In Browser
GIST: Insert Code Into Current File
~~~

## Keyboard Shortcuts

You can associate the following commands to your own keyboard shortcuts:

~~~
extension.openCodeBlock
extension.openFavoriteCodeBlock
extension.createCodeBlock
extension.openCodeBlockInBrowser
extension.deleteCodeBlock
extension.removeFileFromCodeBlock
extension.addToCodeBlock
extension.changeCodeBlockDescription
extension.insertCode
~~~

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
