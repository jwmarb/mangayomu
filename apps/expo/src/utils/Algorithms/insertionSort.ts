import { Comparator } from '@utils/Algorithms/Comparator/Comparator.interfaces';

export default function insertionSort<T>(arr: T[], comparator: Comparator<T>): T[] {
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
  return arr;
}
