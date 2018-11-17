// tslint:disable:no-any no-magic-numbers no-unsafe-any
import { gists } from '../gists-service';

describe('GistService tests', () => {
  let testGists: any;
  beforeEach(() => {
    testGists = gists;
  });
  test('has default baseUrl', () => {
    expect.assertions(1);

    expect(testGists.options).toStrictEqual({
      baseUrl: 'https://api.github.com'
    });
  });
  describe('#reset', () => {
    test('sets baseUrl properly', () => {
      expect.assertions(1);

      testGists.reset({ baseUrl: 'https://foo.bar/api' });
      expect(testGists.options).toStrictEqual({
        baseUrl: 'https://foo.bar/api'
      });
    });
  });
  describe('#getAll', () => {
    test('should have getAll function', (done) => {
      expect.assertions(1);

      testGists.getAll().then((response: any) => {
        expect(response.data[0].description).toBe('gist one');
        done();
      });
    });
  });
  describe('#getStarred', () => {
    test('should have getAll function', (done) => {
      expect.assertions(1);

      testGists.getStarred().then((response: any) => {
        expect(response.data[0].description).toBe('gist one');
        done();
      });
    });
  });
});
