/**
 * Reverses the order of an array without mutating it. Instead, it returns a new copy of it.
 * @param arr The array to reverse
 * @returns Returns a reverse order of the array
 */
export default function reverseArray<T>(arr: T[]) {
  const n = arr.length / 2;
  const copy: T[] = [];
  copy.length = arr.length;
  for (let i = 0; i < n; i++) {
    const front = arr[i];
    const back = arr[arr.length - 1 - i];
    copy[i] = back;
    copy[arr.length - 1 - i] = front;
  }
  return copy;
}
