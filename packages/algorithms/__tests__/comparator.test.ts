import {
  AscendingNumberComparator,
  AscendingStringComparator,
  DescendingNumberComparator,
  DescendingStringComparator,
} from '../src';

test('StringComparator', () => {
  expect(['b', 'a', 'd', 'c'].sort(AscendingStringComparator)).toEqual([
    'a',
    'b',
    'c',
    'd',
  ]);
  expect(['b', 'a', 'd', 'c'].sort(DescendingStringComparator)).toEqual([
    'd',
    'c',
    'b',
    'a',
  ]);
});

test('NumberComparator', () => {
  expect([5, 3, 2, 9].sort(AscendingNumberComparator)).toEqual([2, 3, 5, 9]);
  expect([5, 3, 2, 9].sort(DescendingNumberComparator)).toEqual([9, 5, 3, 2]);
});
