import * as vscode from 'vscode';

export interface StorageService {
  name: string;
  label: string;
  description: string;
  isAuthenticated(): boolean;
  login(username: string, password: string): Promise<void>;
  list(favorite?: boolean): Promise<QuickPickStorageBlock[]>;
  getStorageBlock(url: string): Promise<StorageBlock>;
  getStorageBlockById(id: string): Promise<StorageBlock>;
  createFile(fileName: string, description: string, text: string, isPrivate?: boolean): Promise<StorageBlock>;
  editFile(storageBlockId: string, fileName: string, text: string): Promise<void>;
  deleteStorageBlock(id: string): Promise<void>;
  removeFileFromStorageBlock(id: string, fileName: string): Promise<void>;
  changeDescription(id: string, description: string): Promise<void>;
}

export interface StorageBlock {
  id: string;
  comments: number;
  comments_url: string;
  commits_url: string;
  created_at: string;
  updated_at: string;
  description: string;
  url: string;
  html_url: string;
  files: { [filename: string]: CodeFile };
  public: boolean;
  truncated: boolean;
}

export interface CodeFile {
  content: string;
}

export interface QuickPickStorageBlock extends vscode.QuickPickItem {
  block: StorageBlock
}