// tslint:disable:no-any
module.exports = {
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
    showErrorMessage: jest.fn(),
    showInformationMessage: jest.fn(),
    showQuickPick: jest.fn(),
    showTextDocument: jest.fn()
  },
  workspace: {
    openTextDocument: jest.fn()
  }
};
