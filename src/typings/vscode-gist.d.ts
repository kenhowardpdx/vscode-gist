interface StorageService {
  name: string;
  isAuthenticated(): boolean;
  login(username: string, password: string): Promise<void>;
  list(): Promise<StorageBlock[]>;
  getFileByUrl(url: string): Promise<StorageBlock>;
}

interface StorageBlock {
  id: string;
  label: string;
  description: string;
  url: string;
  files: { [filename: string]: { content: string; } };
}