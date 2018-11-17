module.exports = {
  join: jest.fn((...paths) => ['var', 'T', 'tmp', ...paths].join('/'))
};
