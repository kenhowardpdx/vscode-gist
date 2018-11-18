// tslint:disable:no-any
module.exports = {
  env: {
    language: 'en-US'
  },
  window: {
    showErrorMessage: jest.fn(),
    showInformationMessage: jest.fn(),
    showQuickPick: jest.fn()
  }
};
