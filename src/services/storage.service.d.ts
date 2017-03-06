import * as vscode from 'vscode';

export interface StorageService {
  name: string;
  isAuthenticated(): boolean;
  login(username: string, password: string): Promise<void>;
  list(): Promise<StorageBlock[]>;
  getStorageBlock(url: string): Promise<StorageBlock>;
  editFile(storageBlockId: string, fileName: string, file: vscode.TextDocument): Promise<void>;
}

export interface StorageBlock {
  id: string;
  label: string;
  description: string;
  url: string;
  files: { [filename: string]: CodeFile };
}

export interface CodeFile {
  content: string;
}