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
  public static cleanup() {
    const storageKeys = Object.keys(this.batchRecord);
    console.log('Cleanup called. Saved states to Async Storage');
    for (let i = 0; i < storageKeys.length; i++) {
      AsyncStorage.setItem(storageKeys[i], JSON.stringify(this.batchRecord[storageKeys[i]]));
    }
  }

  private key: string;
  private static batchRecord: Record<string, any> & object = {};
  private timeout: NodeJS.Timeout | undefined;
  private revisions: number;
  private addToBatch(val: any) {
    StorageManager.batchRecord[this.key] = val;

    if (this.timeout == null) {
      if (this.revisions === -1) {
        console.log(`Wrote INITIAL revision of ${this.key} AsyncStorage`);
        AsyncStorage.setItem(this.key, JSON.stringify(StorageManager.batchRecord[this.key]));
      } else
        this.timeout = setTimeout(() => {
          console.log(`Wrote revision #${this.revisions} of ${this.key} AsyncStorage`);
          this.revisions = 0;
          AsyncStorage.setItem(this.key, JSON.stringify(StorageManager.batchRecord[this.key]), () => {
            clearTimeout(this.timeout);
            this.timeout = undefined;
          });
        }, 500);
    }
    this.revisions++;
  }

  public constructor(key: string) {
    this.key = key;
    this.revisions = -1;
  }

  public static async initialize() {
    for (const key of this.activeManagedKeys) {
      await this.manage(key).get();
    }
  }

  public get(): Promise<T | null> {
    return new Promise((res, rej) => {
      if (!StorageManager.batchRecord.hasOwnProperty(this.key))
        AsyncStorage.getItem(this.key, (err, json) => {
          if (err) return rej(err.message);
          if (json == null) {
            StorageManager.batchRecord[this.key] = null;
            return res(null);
          }
          const parsed = JSON.parse(json);
          StorageManager.batchRecord[this.key] = parsed;

          return res(parsed);
        });
      else return res(StorageManager.batchRecord[this.key]);
    });
  }

  public set(value: T): void {
    this.addToBatch(value);
  }
}

export default StorageManager;
