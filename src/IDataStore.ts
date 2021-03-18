export interface IDataStore {
  get(token: string): Promise<string>;
  put(token: string, secret: string): Promise<void>;
  delete(token: string): Promise<void>;
}
