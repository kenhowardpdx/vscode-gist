// tslint:disable:no-any no-unsafe-any no-magic-numbers

import { window } from 'vscode';

import { prompt } from '../prompt';

const showInputBoxSpy: jest.SpyInstance<any> = jest.spyOn(
  window,
  'showInputBox'
);

describe('Prompt Tests', () => {
  test('a prompt is made', async () => {
    expect.assertions(2);

    await prompt('foo', 'bar');

    expect(showInputBoxSpy.mock.calls).toHaveLength(1);
    expect(showInputBoxSpy).toHaveBeenCalledWith({
      prompt: 'foo',
      value: 'bar'
    });
  });
});
