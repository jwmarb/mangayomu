import AsyncStorage from '@react-native-async-storage/async-storage';
import { StringComparator } from '@utils/Algorithms';
import SortedList from '@utils/SortedList';

class StorageManager<T> {
  private static activeManagedKeys: SortedList<string> = new SortedList(StringComparator);
  public static getActiveKeys(): string[] {
    return this.activeManagedKeys.toArray();
  }
  public static manage<T>(key: string) {
    if (this.activeManagedKeys.indexOf(key) === -1) this.activeManagedKeys.add(key);
    return new StorageManager<T>(key);
  }

  private key: string;

  public constructor(key: string) {
    this.key = key;
  }

  public async get(): Promise<T | null> {
    try {
      const json = await AsyncStorage.getItem(this.key);
      if (json == null) return null;
      return JSON.parse(json);
    } catch (e: any) {
      throw Error(e);
    }
  }

  public async set(value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(this.key, JSON.stringify(value));
    } catch (e: any) {
      throw Error(e);
    }
  }
}

export default StorageManager;
