import * as assert from 'assert';
import { getToken } from '../../src/api/auth';

suite('Auth', () => {
  test('getToken returns string', () => {
    assert.equal(typeof getToken(), 'string');
  });
});