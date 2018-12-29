// tslint:disable:no-any no-unsafe-any
module.exports = {
  basename: jest.fn((input: string) => input.split('/').pop()),
  dirname: jest.fn((input) => input),
  join: jest.fn((...paths) => ['var', 'T', 'tmp', ...paths].join('/')),
  sep: '/'
};
