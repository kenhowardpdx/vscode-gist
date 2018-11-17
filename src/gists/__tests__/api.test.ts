// tslint:disable:no-any no-magic-numbers
import { list } from '../api';

describe('Gists API Tests', () => {
  describe('#list', () => {
    test('list without params should return one block', async () => {
      expect.assertions(2);

      const storageBlocks = await list();

      expect(storageBlocks.length).toBe(1);

      expect(storageBlocks[0].description).toBe('test standard');
    });
    test('list with starred params should return one block', async () => {
      expect.assertions(2);

      const storageBlocks = await list(true);

      expect(storageBlocks.length).toBe(1);

      expect(storageBlocks[0].description).toBe('test starred');
    });
  });
});
