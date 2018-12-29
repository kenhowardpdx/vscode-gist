import { Memento } from 'vscode';

import { GISTS_BASE_URL } from '../constants';

export const up = (
  state: Memento,
  cb: (err: Error | undefined) => void
): void => {
  let error: Error | undefined;
  try {
    const key = state.get<string>('gisttoken');
    state.update('gisttoken', undefined);
    state.update('gist_provider', undefined);
    if (key) {
      const url = GISTS_BASE_URL;
      const name = 'github';
      const active = true;

      state.update('profiles', { [name]: { active, key, url } });
    }
  } catch (err) {
    // tslint:disable-next-line: no-unsafe-any
    error = err ? err : new Error('unknown migration error');
  }

  cb(error);
};
