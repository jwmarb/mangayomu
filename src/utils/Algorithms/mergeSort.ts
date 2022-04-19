import { Comparator } from './Comparator/Comparator.interfaces';

export default function mergeSort<T>(arr: T[], comparator: Comparator<T, T>): T[] {
  let n = arr.length;
  const m = Math.floor(n / 2);

  if (n <= 1) return arr;

  return merge(mergeSort(arr.splice(0, m), comparator), mergeSort(arr, comparator), comparator);
}

function merge<T>(left: T[], right: T[], comparator: Comparator<T, T>): T[] {
  const newArr: T[] = [];
  while (left.length && right.length) {
    const comparison = comparator(left[0], right[0]);
    if (comparison < 0) newArr.push(left.shift()!); // These arrays will always have a length greater than 0
    else newArr.push(right.shift()!);
  }

  return [...newArr, ...left, ...right];
}
