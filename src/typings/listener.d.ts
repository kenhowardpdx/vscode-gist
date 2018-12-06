type Listener = number;
type ListenerFn = (...args: any[]) => any;

type ListenerInitializer = (
  services: Services,
  utils: Utils
) => [Listener, ListenerFn];
