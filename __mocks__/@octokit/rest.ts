// tslint:disable:no-any
jest.genMockFromModule('@octokit/rest');

const mockedGists = {
  getAll: jest.fn().mockResolvedValue({
    data: [
      {
        description: 'test standard',
        files: ['one.md', 'two.md'],
        id: 'test123'
      }
    ]
  }),
  getStarred: jest.fn().mockResolvedValue({
    data: [
      {
        description: 'test starred',
        files: ['one.md', 'two.md'],
        id: 'test123'
      }
    ]
  })
};

module.exports = (): object => ({
  gists: mockedGists
});
