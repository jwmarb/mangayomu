import { binary } from '@utils/Algorithms';
import { Comparator } from '@utils/Algorithms/Comparator/Comparator.interfaces';

/**
 * An extension to the Array class. Whenever data is accessed a lot more than it is added, time complexity becomes a concern. Similar to the Array class, this class automatically adds elements to an inserted array while maintaining its order. This class uses binary search rather than linear search. This class has a total time complexity of O(log(n)) when adding and searching elements.
 */
class SortedList<T> {
  private arr: T[];
  private comparator?: Comparator<T>;

  public constructor(comparator?: Comparator<T>, items?: T[], alreadySorted?: boolean) {
    this.arr = items ? (items.length > 0 ? (alreadySorted ? items : items.sort(comparator)) : []) : [];
    this.comparator = comparator;
  }

  /**
   * Replenish SortedList methods of a JSONified SortedList object
   * @param jsonObj The SortedList that has been converted to a JSON object
   * @param comparator A comparator used for binary operations
   * @returns Returns an instance of SortedList
   */
  public static rehydrate<T>(jsonArr: any[], comparator: Comparator<T>) {
    return new SortedList<T>(comparator, jsonArr, true);
  }

  /**
   * Remove an item in the array while persisting its order
   * @param item The item to remove in the array
   */
  public remove(item: T) {
    if (this.comparator == null) throw Error(`A comparator is required in order to perform the operation`);
    const indexToRemove = binary.suggest(this.arr, item, this.comparator);
    this.arr.splice(indexToRemove, 1);
  }

  /**
   * Remove all items matching "item" in the array. This is a linear operation
   * @param item The item to remove in the array including its copies
   */
  public removeAllOf(item: T) {
    let i = 0;
    while (i < this.arr.length) {
      if (this.arr[i] === item) {
        this.arr.splice(i, 1);
      } else i++;
    }
  }

  /**
   * Add an item to the array while persisting its order
   * @param item The item to add to the array
   */
  public add<K = T>(item: T | K[], mapFn: (el: K, index: number) => T = (el) => el as unknown as T) {
    if (this.comparator == null) throw Error(`A comparator is required in order to perform the operation`);
    if (Array.isArray(item)) {
      let mapped: T;
      for (let i = 0; i < item.length; i++) {
        mapped = mapFn(item[i], i);
        const indexToInsert = binary.suggest(this.arr, mapped, this.comparator);
        this.arr.splice(indexToInsert, 0, mapped);
      }
    } else {
      const indexToInsert = binary.suggest(this.arr, item, this.comparator);
      this.arr.splice(indexToInsert, 0, item);
    }
  }

  /**
   * Get an element according to its index
   * @param index The index to get an item
   * @returns Returns an item from the index
   */
  public get(index: number) {
    return this.arr[index];
  }

  /**
   * Get the index of an item in the array. Uses binary search
   * @param item The item to find
   * @returns Returns a number indicating the index position of the item
   */
  public indexOf(item: T) {
    if (this.comparator == null) throw Error(`A comparator is required in order to perform the operation`);
    return binary.search(this.arr, item, this.comparator);
  }

  /**
   * Converts the SortedList into an array, allowing access to native JavaScript array methods, but also losing functionality provided by SortedList
   * @returns Returns the SortedList as an array
   */
  public toArray(): T[] {
    return this.arr;
  }

  public toString(): string {
    return this.arr.toString();
  }

  /**
   * Sort the array with a different compare function. Using a different compare function will be persisted, overriding the old compare function.
   * @param comparator A function comparing two values, returning the differences of the values (-1 means A is behind B, 0 means A is equal to B, 1 means A is after B)
   */
  public sort(comparator: Comparator<T>) {
    this.comparator = comparator;
    this.arr.sort(comparator);
  }

  public [Symbol.iterator](): Iterator<T> {
    return this.arr.values();
  }

  /**
   * Get the size of the list
   * @returns Returns the size of the list
   */
  public size(): number {
    return this.arr.length;
  }
}

export default SortedList;
