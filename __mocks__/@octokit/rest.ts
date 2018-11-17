// tslint:disable:no-any
jest.genMockFromModule('@octokit/rest');

const mockedGists = {
  getAll: jest.fn().mockResolvedValue({
    data: [
      {
        created_at: new Date().toString(),
        description: 'test standard',
        files: {
          'one.md': {
            filename: 'one.md',
            language: 'markdown',
            raw_url: 'https://foo.bar/api/test123/1',
            size: '11111',
            type: 'text'
          },
          'two.md': {
            filename: 'two.md',
            language: 'markdown',
            raw_url: 'https://foo.bar/api/test123/2',
            size: '22222',
            type: 'text'
          }
        },
        id: 'test123',
        updated_at: new Date().toString()
      }
    ]
  }),
  getStarred: jest.fn().mockResolvedValue({
    data: [
      {
        created_at: new Date().toString(),
        description: 'test starred',
        files: {
          'one.md': {
            filename: 'one.md',
            language: 'markdown',
            raw_url: 'https://foo.bar/api/test123/1',
            size: '11111',
            type: 'text'
          },
          'two.md': {
            filename: 'two.md',
            language: 'markdown',
            raw_url: 'https://foo.bar/api/test123/2',
            size: '22222',
            type: 'text'
          }
        },
        id: 'test123',
        updated_at: new Date().toString()
      }
    ]
  })
};

module.exports = (): object => ({
  gists: mockedGists
});
