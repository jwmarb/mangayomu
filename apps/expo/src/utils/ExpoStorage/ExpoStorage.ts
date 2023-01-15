import { KeyValuePair } from '@react-native-async-storage/async-storage/lib/typescript/types';
import * as FileSystem from 'expo-file-system';

/**
 * ExpoStorage is basically an extension of AsyncStorage in which there is no 6 MB limit
 */
class ExpoStorage {
  private readonly STORAGE_DIRECTORY = FileSystem.documentDirectory + 'device_data/';
  public readonly IMAGE_CACHE_DIRECTORY = FileSystem.cacheDirectory + 'images/';
  private async createDir(path: string) {
    try {
      await FileSystem.readDirectoryAsync(path);
    } catch (e) {
      await FileSystem.makeDirectoryAsync(path);
    }
  }
  public async initialize() {
    try {
      this.createDir(this.STORAGE_DIRECTORY);
      this.createDir(this.IMAGE_CACHE_DIRECTORY);
    } catch (e) {
      console.error(e);
    }
  }
  private transformToURI(key: string) {
    return this.STORAGE_DIRECTORY + key;
  }
  public async multiGet(keys: string[]): Promise<KeyValuePair[]> {
    return Promise.all(keys.map(async (key) => [key, await this.getItem(key)]));
  }

  public async multiSet(keyValuePairs: [string, string][]): Promise<void> {
    await Promise.all(keyValuePairs.map(async ([key, value]) => await this.setItem(key, value)));
  }

  /**
   * Get all keys stored in ExpoStorage
   * @returns Returns an array of keys
   */
  public async getAllKeys(): Promise<string[]> {
    return await FileSystem.readDirectoryAsync(this.STORAGE_DIRECTORY);
  }

  public async displayOccupiedStorage() {
    console.log('-----------');
    const keys = await this.getAllKeys();
    const data = await this.multiGet(keys);
    for (const [key, value] of data) {
      if (value != null)
        console.log(`${key} -> ${((encodeURI(value).split(/%..|./).length - 1) / 1024).toFixed(2)} KB`);
    }
    console.log('-----------');
  }

  public async removeItem(key: string) {
    try {
      await FileSystem.deleteAsync(this.transformToURI(key), { idempotent: true });
    } catch (e) {
      throw Error(e as any);
    }
  }

  /**
   * Set a key-value pair in storage
   * @param key The key to set a value
   * @param value The value to set on the key
   */
  public async setItem(key: string, value: string): Promise<void> {
    try {
      await FileSystem.writeAsStringAsync(this.transformToURI(key), value);
    } catch (e) {
      throw Error(e as any);
    }
  }
  /**
   * Get an item from storage
   * @param key The key to obtain the value from
   * @returns Returns the value of the key as a string
   */
  public async getItem(key: string): Promise<string | null> {
    try {
      return await FileSystem.readAsStringAsync(this.transformToURI(key));
    } catch (e) {
      return null;
    }
  }

  /**
   * Clears the storage
   */
  public async clear(): Promise<void> {
    await Promise.all((await this.getAllKeys()).map((key) => this.removeItem(key)));
  }
}

export default new ExpoStorage();
