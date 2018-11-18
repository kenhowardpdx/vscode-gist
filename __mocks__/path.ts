// tslint:disable:no-any no-unsafe-any
module.exports = {
  dirname: jest.fn((input) => input),
  join: jest.fn((...paths) => ['var', 'T', 'tmp', ...paths].join('/')),
  sep: '/'
};
