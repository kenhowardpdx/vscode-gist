import * as fs from 'fs';
import * as path from 'path';
import * as tmp from 'tmp';
import { TextEditor } from 'vscode';

import { TMP_DIRECTORY_PREFIX } from '../constants';

const dirSync = (token: string): string => {
  const prefix = `${[TMP_DIRECTORY_PREFIX, token].join('_')}_`;
  const directory = tmp.dirSync({ prefix });

  return directory.name;
};

export const fileSync = (
  token: string,
  filename: string,
  content: string
): string => {
  const directory = dirSync(token);
  const filePath = path.join(directory, filename);
  fs.writeFileSync(filePath, content);

  return filePath;
};

export const filesSync = (
  token: string,
  files: { [x: string]: { content: string } }
): string[] => {
  const filePaths: string[] = [];
  for (const filename in files) {
    if (files.hasOwnProperty(filename)) {
      const { content } = files[filename];
      filePaths.push(fileSync(token, filename, content));
    }
  }

  return filePaths;
};

export const extractTextDocumentDetails = (
  doc: GistTextDocument,
  editor?: TextEditor
): {
  content: string;
  filename: string;
  id: string;
  language: string;
  path: string;
} => {
  const sep = path.sep === '\\' ? '\\\\' : path.sep;
  const regexp = new RegExp(
    `.*${TMP_DIRECTORY_PREFIX}_([^_]*)_[^${sep}]*${sep}(.*)`
  );
  const [fullPath, id, filename] = doc.fileName.match(regexp) || ['', '', ''];
  const content = doc.getText();

  const { languageId } = editor ? editor.document : { languageId: 'unknown' };

  return {
    content,
    filename,
    id,
    language: languageId,
    path: path.dirname(fullPath)
  };
};
