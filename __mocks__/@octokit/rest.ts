// tslint:disable:no-any no-unsafe-any no-magic-numbers
jest.genMockFromModule<object>('@octokit/rest');

const gistId = Math.random()
  .toString(36)
  .slice(7);

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
    html_url: 'https://foo.bar',
    id: 'test123',
    public: true,
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
    html_url: 'https://foo.bar',
    id: 'test123',
    public: false,
    updated_at: new Date().toString()
  }
];

const gistsResponse = (): Promise<any> =>
  Promise.resolve({
    data: gistsResponseData
  });

const mockedGists = {
  create: jest.fn((params) =>
    Promise.resolve({
      data: {
        created_at: new Date().toString(),
        description: params.description,
        files: params.files,
        id: gistId,
        public: params.public,
        updated_at: new Date().toString()
      }
    })
  ),
  delete: jest.fn(),
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
  gists: mockedGists,
  paginate: jest.fn((options) =>
    Promise.resolve({
      data: { ...gistsResponseData[0], id: options.gist_id }
    })
  )
}));
