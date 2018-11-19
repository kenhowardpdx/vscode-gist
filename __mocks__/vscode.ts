// tslint:disable:no-any
module.exports = {
  env: {
    language: 'en-US'
  },
  extensions: {
    getExtension: jest.fn(() => '1.0.0')
  },
  window: {
    showErrorMessage: jest.fn(),
    showInformationMessage: jest.fn(),
    showQuickPick: jest.fn()
  }
};
