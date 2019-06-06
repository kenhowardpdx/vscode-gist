import { Memento } from 'vscode';

import { logger } from '../logger';

class Files {
  public static getInstance = (): Files =>
    (Files.instance = Files.instance ? Files.instance : new Files())
  private static instance?: Files;
  private state!: Memento;

  public configure(state: Memento): void {
    this.state = state;
  }

  public get(gistId: string, filename: string): void {
    const details = this.state.get(`${gistId}/${filename}`) as object;
    logger.debug('getting details', JSON.stringify(details));
  }
}

export const files = Files.getInstance();
