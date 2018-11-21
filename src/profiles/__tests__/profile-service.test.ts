// tslint:disable:no-any no-unsafe-any no-magic-numbers
import { profiles } from '../profile-service';

const mockState = { get: jest.fn(), update: jest.fn() };
const gh = { GitHub: { active: false, key: 'foo', url: 'http://foo.bar.com' } };
const ghe = {
  'GitHub Enterprise': { active: false, key: 'bar', url: 'http://baz.bat.com' }
};

profiles.configure({ state: mockState });

describe('Profile Service Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('#getAll', () => {
    test('should return array', () => {
      expect.assertions(1);

      expect(profiles.getAll()).toStrictEqual([]);
    });
    test('should return array with two profiles', () => {
      expect.assertions(2);

      mockState.get.mockReturnValue(JSON.stringify({ ...gh, ...ghe }));

      expect(profiles.getAll().length).toBe(2);
      expect(profiles.getAll()[1]).toStrictEqual({
        active: ghe['GitHub Enterprise'].active,
        key: ghe['GitHub Enterprise'].key,
        name: 'GitHub Enterprise',
        url: ghe['GitHub Enterprise'].url
      });
    });
  });
  describe('#get', () => {
    test('should return "undefined" if profile none is active', () => {
      expect.assertions(2);

      expect(() => profiles.get()).not.toThrowError();
      expect(profiles.get()).toBeUndefined();
    });
    test('should return a profile when one is active', () => {
      expect.assertions(2);

      const ghe2 = {
        'GitHub Enterprise': { ...ghe['GitHub Enterprise'], active: true }
      };

      mockState.get.mockReturnValue(JSON.stringify({ ...gh, ...ghe2 }));

      expect(() => profiles.get()).not.toThrowError();
      expect(profiles.get()).toStrictEqual({
        active: ghe2['GitHub Enterprise'].active,
        key: ghe2['GitHub Enterprise'].key,
        name: 'GitHub Enterprise',
        url: ghe2['GitHub Enterprise'].url
      });
    });
  });
});
