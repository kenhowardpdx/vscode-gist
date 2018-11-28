// tslint:disable:no-any no-unsafe-any
jest.genMockFromModule<object>('@octokit/rest');

const gistsResponseData = [
  {
    created_at: new Date().toString(),
    description: 'gist one',
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
  },
  {
    created_at: new Date().toString(),
    description: 'gist two',
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
];

const gistsResponse = (): Promise<any> =>
  Promise.resolve({
    data: gistsResponseData
  });

const mockedGists = {
  get: jest.fn((options) =>
    Promise.resolve({
      data: { ...gistsResponseData[0], id: options.gist_id }
    })
  ),
  list: jest.fn(gistsResponse),
  listStarred: jest.fn(gistsResponse),
  update: jest.fn((options) =>
    Promise.resolve({
      data: {
        ...gistsResponseData[0],
        files: {
          ...gistsResponseData[0].files,
          ...options.files
        },
        id: options.gist_id || gistsResponseData[0].id
      }
    })
  )
};

module.exports = jest.fn(() => ({
  authenticate: jest.fn(),
  gists: mockedGists
}));
