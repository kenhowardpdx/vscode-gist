interface Configuration {
  get<T>(key: string): T | undefined;
}
