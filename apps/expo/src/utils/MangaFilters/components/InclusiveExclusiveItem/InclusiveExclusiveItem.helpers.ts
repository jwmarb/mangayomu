import { binary, StringComparator } from '@utils/Algorithms';

export function insertElement(arr: string[], element: string): string[] {
  const n = arr.length;
  if (n === 0) return [element];
  if (arr[n - 1].localeCompare(element) <= 0) return [...arr, element];
  const copy: string[] = [];
  let done = false;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].localeCompare(element) <= 0) copy.push(arr[i]);
    else {
      if (!done) copy.push(element);
      copy.push(arr[i]);
      done = true;
    }
  }

  return copy;
}

export function deleteElement(arr: string[], element: string): string[] {
  if (binary.search(arr, element, StringComparator) === -1) return arr;
  const copy: string[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === element) continue;
    copy.push(arr[i]);
  }
  return copy;
}
