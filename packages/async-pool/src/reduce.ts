import { ReduceFn } from './resolvers';

/**
 * Reduces an input array to some value. This is all asynchronous, however, it reduces by one at a time.
 * @param array The input array
 * @param accumulator An accumulator
 * @param reduceFn A reducer function
 * @returns Returns the accumulated result
 */
export async function asyncReduce<T, R>(
  array: T[],
  accumulator: R,
  reduceFn: ReduceFn<T, R>,
) {
  const n = array.length;
  for (let i = 0; i < n; i++) {
    accumulator = await reduceFn(accumulator, array[i], i, array);
  }
  return accumulator;
}
