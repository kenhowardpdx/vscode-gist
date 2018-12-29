// tslint:disable:no-magic-numbers no-any no-unsafe-any

import { migrations } from '../migration-service';

const state = {
  get: jest.fn(() => ''),
  update: jest.fn()
};

describe('Migrations Tests', () => {
  test('should process migrations', () => {
    expect.assertions(3);

    const migrationCallback = jest.fn((_s, c) => {
      c();
    });

    const migrationOne: any = ['mymigrationone', migrationCallback];
    const migrationTwo: any = ['mygrationtwo', migrationCallback];
    const finalCallback = jest.fn();

    migrations.configure({ migrations: [migrationOne, migrationTwo], state });
    migrations.up(finalCallback);

    expect(finalCallback).toHaveBeenCalled();
    expect(state.update.mock.calls).toHaveLength(2);
    expect(migrationCallback.mock.calls).toHaveLength(2);
  });
});
