// tslint:disable:no-any
module.exports = {
  StatusBarAlignment: {
    Left: true
  },
  Uri: { parse: jest.fn((url: string) => url) },
  commands: {
    executeCommand: jest.fn()
  },
  env: {
    language: 'en-US'
  },
  extensions: {
    getExtension: jest.fn(() => '1.0.0')
  },
  window: {
    createStatusBarItem: jest.fn(),
    showErrorMessage: jest.fn(),
    showInformationMessage: jest.fn(),
    showInputBox: jest.fn(),
    showQuickPick: jest.fn(),
    showTextDocument: jest.fn()
  },
  workspace: {
    getConfiguration: jest.fn(() => ({ get: jest.fn(), update: jest.fn() })),
    openTextDocument: jest.fn()
  }
};
