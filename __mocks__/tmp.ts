// tslint:disable:no-any ban no-magic-numbers no-unsafe-any
const randomString = (): string =>
  Math.random()
    .toString(36)
    .substring(7);

module.exports = {
  dirSync: jest.fn(
    (input: any): any => ({ name: `${input.prefix}${randomString()}` })
  )
};
