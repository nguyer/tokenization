import { IDataStore } from "./IDataStore";

export default class MemoryDataStore implements IDataStore {
  private dataStore = new Map<string, string>();

  async get(token: string): Promise<string> {
    const secret = this.dataStore.get(token);
    if (secret) {
      return secret;
    } else {
      throw Error(`Token '${token}' not found`);
    }
  }
  async put(token: string, secret: string): Promise<void> {
    this.dataStore.set(token, secret);
  }
  async delete(token: string): Promise<void> {
    this.dataStore.delete(token);
  }
}
