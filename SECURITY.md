# Security Policies and Procedures

This document outlines security procedures and general policies for the `Gist Extension`
project.

  * [Reporting a Bug](#reporting-a-bug)
  * [Disclosure Policy](#disclosure-policy)
  * [Comments on this Policy](#comments-on-this-policy)

## Reporting a Bug

The `Gist Extension` team and community take all security bugs in `Gist Extension` seriously.
Thank you for improving the security of `Gist Extension`. We appreciate your efforts and
responsible disclosure and will make every effort to acknowledge your
contributions.

Report security bugs by direct messaging the lead maintainer at @kenhowardpdx.

The lead maintainer will acknowledge your message within 48 hours, and will send a
more detailed response within 48 hours indicating the next steps in handling
your report. After the initial reply to your report, the security team will
endeavor to keep you informed of the progress towards a fix and full
announcement, and may ask for additional information or guidance.

Report security bugs in third-party modules to the person or team maintaining
the module.

## Disclosure Policy

When the security team receives a security bug report, they will assign it to a
primary handler. This person will coordinate the fix and release process,
involving the following steps:

  * Confirm the problem and determine the affected versions.
  * Audit code to find any potential similar problems.
  * Prepare fixes for all releases still under maintenance. These fixes will be
    released as fast as possible to npm.

## Comments on this Policy

If you have suggestions on how this process could be improved please submit a
pull request.

## Security of Gists

Treat Gists as public code.  Secret gists aren't necessarily private.  
If you send the URL of a secret gist to a friend, they'll be able to see it.  
However, if someone you don't know discovers the URL, they'll also be able to see your gist.  
If you need to keep your code away from prying eyes, you may want to [create a private repository](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-new-repository) instead.

## Security History

2020-01-04 - Add security policy.  Dependency issue

* Security issue with package mitigated.
```sh
+ jest@24.9.0
updated 1 package and audited 878996 packages in 15.506s
found 1 high severity vulnerability

  run `npm audit fix` to fix them, or `npm audit` for details

D:\projects\typescript\vscode-gist>npm audit

                       === npm audit security report ===

# Run  npm update https-proxy-agent --depth 3  to resolve 1 vulnerability

  High            Machine-In-The-Middle

  Package         https-proxy-agent

  Dependency of   vscode [dev]

  Path            vscode > vscode-test > https-proxy-agent

  More info       https://npmjs.com/advisories/1184



found 1 high severity vulnerability in 878996 scanned packages
  run `npm audit fix` to fix 1 of them.
```