class Insights {
  public exception(
    context: string,
    properties?: { [x: string]: string },
    measurements?: { [x: string]: number }
  ): void;
  public track(
    eventName: string,
    properties?: { [x: string]: string },
    measurements?: { [x: string]: number }
  ): void;
}
