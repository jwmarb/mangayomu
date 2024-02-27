import { AscendingNumberComparator, add, remove } from '../src';
test('inserts element to sorted array', () => {
  const numbers = [1, 2, 3, 4, 5, 6];

  add(numbers, 7, AscendingNumberComparator);
  expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7]);

  add(numbers, 0, AscendingNumberComparator);
  expect(numbers).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);

  add(numbers, [0, 1, 2, 3, 4, 5, 6, 7], AscendingNumberComparator);
  expect(numbers).toEqual([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7]);

  add(numbers, [], AscendingNumberComparator);
  expect(numbers).toEqual([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7]);
});

test('removes elements from sorted array', () => {
  const numbers = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7];

  expect(
    remove(numbers, [0, 1, 2, 3, 4, 5, 6, 7], AscendingNumberComparator),
  ).toBeTruthy();
  expect(numbers).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);

  expect(remove(numbers, 5, AscendingNumberComparator)).toBeTruthy();
  expect(numbers).toEqual([0, 1, 2, 3, 4, 6, 7]);

  expect(remove(numbers, 831783, AscendingNumberComparator)).toBeFalsy();

  expect(remove(numbers, [], AscendingNumberComparator)).toBeTruthy();
  expect(numbers).toEqual([0, 1, 2, 3, 4, 6, 7]);

  expect(remove(numbers, [8], AscendingNumberComparator)).toBeTruthy();
  expect(remove(numbers, [0, 2, 8], AscendingNumberComparator)).toBeTruthy();
  expect(numbers).toEqual([1, 3, 4, 6, 7]);
});
