import { binary, Comparator } from '@mangayomu/algorithms';

export type Comparators<T, O> = {
  [K in keyof O]: Comparator<T, T>;
};

export default function integrateSortedList<T>(
  arr: T[],
  comparator: Comparator<T, T>,
) {
  return {
    /**
     * Add an item to the list
     * @param item The item to add to the list
     * @param mapFn FOR COMBINING ARARYS TO SORTED LIST ONLY. Mutate what to add to match list type. For example, adding objects to a string list, but you do not want to go through remapping them as strings before adding them, so this function will do it for you.
     * ```js
     * // sortedList is a sorted string[] with values ["Alex", "Viviana"] sorted alphabetically (A-Z);
     * const persons = [{ name: "Bob" }, { name: "Alice" }];
     *
     * // Since the list only accepts strings, each `person` must be converted to a string, such as their name.
     * sortedList.add(persons, (person) => person.name);
     *
     * // sortedList = ["Alex", "Alice", "Bob", "Viviana"]
     * ```
     */
    add<K = T>(
      item: T | K[],
      mapFn: (el: K, index: number) => T = (el) => el as unknown as T,
    ) {
      if (comparator == null)
        throw Error(
          'A comparator is required in order to perform the operation',
        );
      if (Array.isArray(item)) {
        let mapped: T;
        for (let i = 0; i < item.length; i++) {
          mapped = mapFn(item[i], i);
          const indexToInsert = binary.suggest(arr, mapped, comparator);
          arr.splice(indexToInsert, 0, mapped);
        }
      } else {
        const indexToInsert = binary.suggest(arr, item, comparator);
        arr.splice(indexToInsert, 0, item);
      }
    },
    /**
     * Remove an item in the array while persisting its order
     * @param item The item to remove in the array
     */
    remove(item: T) {
      if (comparator == null)
        throw Error(
          'A comparator is required in order to perform the operation',
        );
      const indexToRemove = binary.suggest(arr, item, comparator);
      arr.splice(indexToRemove, 1);
    },
    /**
     * Get the index of an item in the array. Uses binary search
     * @param item The item to find
     * @returns Returns a number indicating the index position of the item
     */
    indexOf(item: T) {
      if (comparator == null)
        throw Error(
          'A comparator is required in order to perform the operation',
        );
      return binary.search(arr, item, comparator);
    },
    /**
     * Sorts the array using insertion sort. Best for nearly-sorted arrays
     */
    insertionSort() {
      const n = arr.length;
      for (let i = 0; i < n; i++) {
        const current = arr[i];
        let j = i - 1;

        while (j > -1 && comparator(current, arr[j]) < 0) {
          arr[j + 1] = arr[j];
          j--;
        }
        arr[j + 1] = current;
      }
    },
  };
}
