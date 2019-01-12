interface Memento {
  /**
   * Return a value.
   *
   * @param key A string.
   * @return The stored value or `undefined`.
   */
  get<T>(key: string): T | undefined;

  /**
   * Return a value.
   *
   * @param key A string.
   * @param defaultValue A value that should be returned when there is no
   * value (`undefined`) with the given key.
   * @return The stored value or the defaultValue.
   */
  get<T>(key: string, defaultValue: T): T;

  /**
   * Store a value. The value must be JSON-stringifyable.
   *
   * @param key A string.
   * @param value A value. MUST not contain cyclic references.
   */
  update(key: string, value: any): Thenable<void>;
}

interface RawProfile {
  active: boolean;
  key: string;
  url: string;
}

interface Profile extends RawProfile {
  name: string;
}

class Profiles {
  public add(name: string, key: string, url?: string, active?: boolean): void;
  public configure(options: { state: Memento }): void;
  public get(): Profile | undefined;
  public getAll(): Profile[];
  public reset(): void;
}
