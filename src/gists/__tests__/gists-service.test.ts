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
  describe('#list', () => {
    test('should have list function', (done) => {
      expect.assertions(1);

      testGists.list().then((response: any) => {
        expect(response.data[0].description).toBe('gist one');
        done();
      });
    });
  });
  describe('#listStarred', () => {
    test('should have listStarred function', (done) => {
      expect.assertions(1);

      testGists.listStarred().then((response: any) => {
        expect(response.data[0].description).toBe('gist one');
        done();
      });
    });
  });
  describe('#get', () => {
    test('should have get function', async () => {
      const results = await testGists.get({ gist_id: 'one-really-cool-id' });
      expect(results.data.id).toBe('one-really-cool-id');
    });
  });
});
