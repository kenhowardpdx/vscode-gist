// tslint:disable:no-any no-unsafe-any
const mockedImplementation = {
  sendTelemetryEvent: jest.fn()
};

// tslint:disable-next-line:no-default-export
export default jest.fn(() => mockedImplementation);
