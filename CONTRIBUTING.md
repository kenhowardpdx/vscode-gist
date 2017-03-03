# Contributing

Pull requests and contributions are warmly welcome.
Please follow existing code style and commit message conventions. Also remember to keep documentation
updated.

**Pull Requests:** You don't need to bump version numbers or modify anything related to releasing.


# Maintaining

## Compiling

There's no need to manually compile. The launch tasks trigger the 'compile' script from the package.json file which continuously watches TypeScript files for changes.

## Test

Run the 'Launch Tests' task from the Debug pane (Ctrl+Shift+D) to execute tests.

## Debug

Run the 'Launch Extension' task from the Debug pane (Ctrl+Shift+D). You can set breakpoints inside your TypeScript files and inspect your code while the extension is running.

## Linting

It's recommended that you have tslint installed globally and have the [vscode-tslint](https://marketplace.visualstudio.com/items?itemName=eg2.tslint) extension installed.

Install tslint globally:
```
npm install -g tslint
```

This will inform you in the editor when your code does not match the project formatting rules.

Alternatively you can run the `lint` task from the command line:
```
npm run lint
```

Please be sure to lint and fix any formatting errors before submitting a pull request.

You can fix formatting errors automatically by running:
```
npm run lint -- --fix
```