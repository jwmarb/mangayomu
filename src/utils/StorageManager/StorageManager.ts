import AsyncStorage from '@utils/ExpoStorage';
import { StringComparator } from '@utils/Algorithms';
import DownloadManager from '@utils/DownloadManager';
import SortedList from '@utils/SortedList';

type ManagedKey = {
  key: string;
  priority: number;
};

class StorageManager<T> {
  private static activeManagedKeys: SortedList<ManagedKey> = new SortedList((a, b) => b.priority - a.priority);
  public static getActiveKeys(): string[] {
    return this.activeManagedKeys.toArray().map((x) => x.key);
  }
  public static manage<T>(key: string, defaultValue: T, priority: number = 0) {
    if (this.activeManagedKeys.indexOf({ key, priority }) === -1) this.activeManagedKeys.add({ key, priority });
    return new StorageManager<T>(key, defaultValue);
  }
  public static async cleanup() {
    console.log(`Cleanup called. Saving [${Object.keys(this.batchRecord)}] to Async Storage`);

    await AsyncStorage.multiSet(Object.values(this.batchRecord).map(([key, val]) => [key, JSON.stringify(val)]));
  }

  private key: string;
  private static batchRecord: Record<string, any> & object = {};
  private timeout: NodeJS.Timeout | undefined;
  private revisions: number;
  private addToBatch(val: any) {
    StorageManager.batchRecord[this.key] = val;
    // AsyncStorage.setItem(this.key, JSON.stringify(StorageManager.batchRecord[this.key]));

    if (this.timeout == null) {
      if (this.revisions === -1) {
        console.log(`Wrote INITIAL revision of ${this.key} AsyncStorage`);
        AsyncStorage.setItem(this.key, JSON.stringify(StorageManager.batchRecord[this.key]));
      } else {
        this.timeout = setTimeout(async () => {
          try {
            console.log(`Wrote revision #${this.revisions} of ${this.key} AsyncStorage`);
            this.revisions = 0;
            await AsyncStorage.setItem(this.key, JSON.stringify(StorageManager.batchRecord[this.key]));
          } finally {
            clearTimeout(this.timeout);
            this.timeout = undefined;
          }
        }, 500);
      }
    }
    this.revisions++;
  }

  public constructor(key: string, defaultValue: T) {
    this.key = key;
    this.revisions = -1;
    StorageManager.batchRecord[key] = defaultValue;
  }

  public static async initialize() {
    const multidata = await AsyncStorage.multiGet(Object.keys(this.batchRecord));
    for (const [key, stringified] of multidata) {
      if (stringified != null) {
        StorageManager.batchRecord[key] = JSON.parse(stringified);
      }
    }
  }

  public get(): T {
    return StorageManager.batchRecord[this.key];
  }

  public set(value: T): void {
    this.addToBatch(value);
  }

  public mutate(fn: (value: T) => T) {
    this.set(fn(StorageManager.batchRecord[this.key]));
  }
}

export default StorageManager;
