// tslint:disable:no-magic-numbers no-any

import { GISTS_BASE_URL } from '../../constants';

import { up } from '../migrate-2.0.0';

const state = {
  get: jest.fn(),
  update: jest.fn()
};

describe('Migrate to 2.0.0 Tests', () => {
  test('should retrieve gisttoken and create a new profile', () => {
    expect.assertions(3);

    state.get.mockReturnValueOnce('myaccesstoken');

    up(state, () => {
      // return void
    });

    expect(state.update.mock.calls[0]).toStrictEqual(['gisttoken', undefined]);
    expect(state.update.mock.calls[1]).toStrictEqual([
      'gist_provider',
      undefined
    ]);
    expect(state.update.mock.calls[2]).toStrictEqual([
      'profiles',
      { github: { active: true, key: 'myaccesstoken', url: GISTS_BASE_URL } }
    ]);
  });
});
