import { binary } from '../src';

function comparator(a: number, b: number) {
  if (a > b) return -1;
  else if (a === b) return 0;

  return 1;
}

test('finds element properly', () => {
  const arr = [5, 4, 3, 2, 1];
  expect(binary.search(arr, 1, comparator)).toBe(4);
  expect(binary.search(arr, 5, comparator)).toBe(0);
  expect(binary.search(arr, 3, comparator)).toBe(2);
  expect(binary.search(arr, 10, comparator)).toBe(-1);
});

test('suggests index to insert to maintain order', () => {
  const arr = [5, 4, 3, 2, 1];
  expect(binary.suggest(arr, 1, comparator)).toBe(4);
  expect(binary.suggest(arr, 0, comparator)).toBe(5);
  expect(binary.suggest(arr, -1, comparator)).toBe(5);

  arr.push(1);

  expect(binary.suggest(arr, -1, comparator)).toBe(6);
  expect(binary.suggest(arr, 6, comparator)).toBe(0);
});

test('gets upper/lower bounds', () => {
  const arr = [5, 5, 5, 4, 3, 2, 2, 1];
  const distinct = [5, 4, 3, 2, 1];
  const dup = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  const arr2 = [
    87, 87, 66, 66, 66, 66, 65, 54, 33, 33, 33, 33, 33, 32, 31, 9, 8, 8, 6, 6,
    5, 4, 3, 3, 3, 3, 2, 2, 1, 0,
  ];

  expect(binary.upperBound(arr, 5, comparator)).toBe(2);
  expect(binary.lowerBound(arr, 5, comparator)).toBe(0);

  expect(binary.upperBound(arr, 6, comparator)).toBe(-1);
  expect(binary.lowerBound(arr, 0, comparator)).toBe(-1);

  expect(binary.upperBound(arr2, 87, comparator)).toBe(1);
  expect(binary.lowerBound(arr2, 87, comparator)).toBe(0);

  expect(binary.upperBound(arr2, 10, comparator)).toBe(-1);
  expect(binary.lowerBound(arr2, 7, comparator)).toBe(-1);

  expect(binary.upperBound(arr2, 7, comparator)).toBe(-1);
  expect(binary.lowerBound(arr2, 10, comparator)).toBe(-1);

  expect(binary.upperBound(arr2, 33, comparator)).toBe(12);
  expect(binary.lowerBound(arr2, 33, comparator)).toBe(8);

  expect(binary.upperBound(arr2, 1, comparator)).toBe(arr2.length - 2);
  expect(binary.lowerBound(arr2, 1, comparator)).toBe(arr2.length - 2);

  expect(binary.upperBound(distinct, 5, comparator)).toBe(0);
  expect(binary.lowerBound(distinct, 5, comparator)).toBe(0);

  expect(binary.upperBound(distinct, 6, comparator)).toBe(-1);
  expect(binary.upperBound(distinct, 0, comparator)).toBe(-1);

  expect(binary.upperBound(distinct, 0, comparator)).toBe(-1);
  expect(binary.upperBound(distinct, 6, comparator)).toBe(-1);

  expect(binary.upperBound(dup, 1, comparator)).toBe(9);
  expect(binary.lowerBound(dup, 1, comparator)).toBe(0);

  expect(binary.upperBound(dup, 2, comparator)).toBe(-1);
  expect(binary.lowerBound(dup, 0, comparator)).toBe(-1);

  expect(binary.upperBound(dup, 0, comparator)).toBe(-1);
  expect(binary.lowerBound(dup, 2, comparator)).toBe(-1);
});

test('gets range', () => {
  const arr = [1, 1, 1, 1, 1, 1, 0, 0];
  const arr2 = [10, 9, 9, 4, 3, 3, 3, 3, 2, 2, 1, 0, 0, -1];
  expect(binary.range(arr, 1, comparator)).toEqual([0, 6]);
  expect(binary.range(arr, 0, comparator)).toEqual([6, 8]);
  expect(binary.range(arr, 2, comparator)).toEqual([-1, -1]);
  expect(binary.range(arr, -1, comparator)).toEqual([-1, -1]);
  expect(binary.range(arr2, 9, comparator)).toEqual([1, 3]);
  expect(binary.range(arr2, 10, comparator)).toEqual([0, 1]);
  expect(binary.range(arr2, -1, comparator)).toEqual([13, 14]);
});
