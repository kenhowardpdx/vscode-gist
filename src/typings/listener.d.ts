type Listener = number;
type ListenerFn = (...args: any[]) => any;

type ListenerInitializer = (
  config: Configuration,
  services: Services,
  utils: Utils
) => [Listener, ListenerFn];
