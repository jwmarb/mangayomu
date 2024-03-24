import { MutableAbstractFilter } from '@mangayomu/schema-creator';
import MangaSource from '../scraper/scraper';
import {
  generateHash,
  hashCode,
  hashFilter,
  isFiltersEqual,
} from '../scraper/scraper.helpers';

export type CacheEntry<TManga> = [
  string,
  MutableAbstractFilter,
  unknown[],
  number,
]; // [query, filters, mangas, expiry_date]

export class CacheManager<TManga> {
  public static readonly GROW_THRESHOLD = 0.5;
  public static readonly SHRINK_THRESHOLD = 0.25;
  public static readonly TTL = 1000 * 60 * 5; // 5 minutes
  private table: CacheEntry<TManga>[];
  private order: CacheEntry<TManga>[]; // ordered entries
  private _capacity: number;
  private initCapacity: number;
  private _size: number;
  private source: MangaSource;
  private enableResizing: boolean;
  public constructor(source: MangaSource, initialCapacity = 10) {
    this.initCapacity = initialCapacity;
    this._capacity = initialCapacity;
    this._size = 0;
    this.source = source;
    this.table = new Array(10);
    this.order = [];
    this.enableResizing = true;
  }

  private loadFactor() {
    return this._size / this._capacity;
  }

  private resizeIfPossible() {
    if (
      this.enableResizing &&
      (this.loadFactor() >= CacheManager.GROW_THRESHOLD ||
        this.loadFactor() <= CacheManager.SHRINK_THRESHOLD)
    ) {
      let newCapacity = this._capacity;
      if (this.loadFactor() >= CacheManager.GROW_THRESHOLD) {
        while (CacheManager.GROW_THRESHOLD <= this._size / newCapacity) {
          newCapacity <<= 1;
        }
      } else if (this.loadFactor() <= CacheManager.SHRINK_THRESHOLD) {
        while (CacheManager.SHRINK_THRESHOLD >= this._size / newCapacity) {
          if (newCapacity <= this.initCapacity) break;
          newCapacity >>= 1;
        }
      } else {
        throw new Error('Unnecessary resize operation call');
      }
      const newTable: CacheEntry<TManga>[] = new Array(newCapacity);
      const n = this.order.length;
      for (let i = 0; i < n; i++) {
        const [query, filters] = this.order[i];
        const idx = this.hash(query, filters, newCapacity);

        let isInserted = false;
        // linear probe
        for (let j = idx; j < newCapacity; j++) {
          if (newTable[j] == null) {
            newTable[j] = this.order[i];
            isInserted = true;
            break;
          }
        }
        if (!isInserted) {
          for (let j = 0; j < idx; j++) {
            if (newTable[j] == null) {
              newTable[j] = this.order[i];
              isInserted = true;
              break;
            }
          }
        }
        if (!isInserted) throw new Error('Failed to resize hash table');
      }
      this.table = newTable;
      this._capacity = newCapacity;
    }
  }
  public hash(
    query: string,
    filters: MutableAbstractFilter,
    capacity = this.capacity(),
  ) {
    return (
      Math.abs(hashCode(this.source.NAME) * generateHash(query, filters)) %
      capacity
    ); // convert to an unsigned int
  }

  public clear() {
    this.table = new Array(this.initCapacity);
    this._capacity = this.initCapacity;
    this.order = [];
    this._size = 0;
  }

  public getEntries() {
    return this.table;
  }

  public lockResizing() {
    this.enableResizing = false;
  }

  public unlockResizing() {
    this.enableResizing = true;
    this.resizeIfPossible();
  }

  public add(
    query: string,
    mangas: unknown[],
    filters: MutableAbstractFilter = {},
  ): boolean {
    this._size++;
    this.resizeIfPossible();
    const idx = this.hash(query, filters);
    // console.log(
    //   `hash for "${query}" is ${idx} with...\n${JSON.stringify({
    //     query: hashCode(query),
    //     filters: hashFilter(filters),
    //     source: hashCode(this.source.NAME),
    //     capacity: this.capacity(),
    //   })}`,
    // );
    // linear probe
    for (let i = idx; i < this._capacity; i++) {
      if (this.table[i] == null) {
        this.table[i] = [query, filters, mangas, Date.now() + CacheManager.TTL];
        this.order.push(this.table[i]);
        return true;
      }
      const [existingQuery, existingFilters] = this.table[i];
      if (existingQuery === query && isFiltersEqual(existingFilters, filters)) {
        this.order.splice(this.order.indexOf(this.table[i]), 1);
        this.table[i] = [query, filters, mangas, Date.now() + CacheManager.TTL];
        this.order.push(this.table[i]);
        this._size--;
        return true;
      }
    }
    for (let i = 0; i < idx; i++) {
      if (this.table[i] == null) {
        this.table[i] = [query, filters, mangas, Date.now() + CacheManager.TTL];
        this.order.push(this.table[i]);
        return true;
      }
      const [existingQuery, existingFilters] = this.table[i];
      if (existingQuery === query && isFiltersEqual(existingFilters, filters)) {
        this.order.splice(this.order.indexOf(this.table[i]), 1);
        this.table[i] = [query, filters, mangas, Date.now() + CacheManager.TTL];
        this.order.push(this.table[i]);
        this._size--;
        return true;
      }
    }
    this._size--;
    return false;
  }
  public get(
    query: string,
    filters: MutableAbstractFilter = {},
  ): TManga[] | null {
    const idx = this.hash(query, filters);

    const now = Date.now();
    // find where this entry is
    for (let i = idx; i < this._capacity; i++) {
      if (this.table[i] == null) return null;
      const [queryEntry, filterEntry, mangas, exp] = this.table[i];

      if (
        queryEntry === query &&
        isFiltersEqual(filterEntry, filters) &&
        now <= exp
      ) {
        return mangas as TManga[];
      }

      // check if this entry is expired
      if (now > exp) {
        this.order.splice(this.order.indexOf(this.table[i]), 1);
        delete this.table[i];
        this._size--;
        this.resizeIfPossible();
      }
    }

    for (let i = 0; i < idx; i++) {
      const [queryEntry, filterEntry, mangas, exp] = this.table[i];
      if (
        queryEntry === query &&
        isFiltersEqual(filterEntry, filters) &&
        now <= exp
      ) {
        return mangas as TManga[];
      }

      // check if this entry is expired
      if (now > exp) {
        this.order.splice(this.order.indexOf(this.table[i]), 1);
        delete this.table[i];
        this._size--;
        this.resizeIfPossible();
      }
    }

    return null;
  }

  public size() {
    return this._size;
  }

  public capacity() {
    return this._capacity;
  }
}
