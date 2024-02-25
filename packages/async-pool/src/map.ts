import {
  MapFn,
  promiseAllResolver,
  promiseAllSettledResolver,
} from './resolvers';

async function async<T, R, Result>(
  array: T[],
  concurrencyLimit: number,
  mapFn: (element: T, i: number, self: T[]) => Promise<R>,
  resolver: (arr: Promise<R>[]) => Promise<Result[]>,
): Promise<Result[]> {
  let r = 0;
  let resultN = 0;
  let awaited: Result[];
  const n = array.length;
  const result = new Array<Result>(array.length);
  const pool = new Array<Promise<R>>(concurrencyLimit);

  for (let i = 0; i < n; i++) {
    pool[r] = mapFn(array[i], i, array);
    r = (r + 1) % concurrencyLimit;

    if (r === 0) {
      awaited = await resolver(pool);
      for (let k = 0; k < concurrencyLimit; k++) {
        result[resultN + k] = awaited[k];
      }
      resultN += concurrencyLimit;
    }
  }

  if (r > 0) {
    awaited = await resolver(pool);
    for (let i = 0; i < r; i++) {
      result[resultN + i] = awaited[i];
    }
  }

  return result;
}

/**
 * Asynchronous operation for `Array.map` that operates concurrently
 * @param array The input array
 * @param concurrencyLimit The # of concurrent executions
 * @param mapFn A callback function that maps an element of `array` to something else
 * @returns Returns a Promise containing the resolved elements of `array`
 */
export function asyncMap<T, R>(
  array: T[],
  concurrencyLimit: number,
  mapFn: MapFn<T, R>,
) {
  return async(array, concurrencyLimit, mapFn, promiseAllResolver);
}

/**
 * Asynchronous operation for `Array.map` that operates concurrently. If at least one Promise rejects in the input
 * array, the whole operation will not throw an error.
 * @param array The input array
 * @param concurrencyLimit The # of concurrent executions
 * @param mapFn A callback function that maps an element of `array` to something else
 * @returns Returns each mapped element wrapped with a `PromiseSettledResult`
 */
export function asyncSettledMap<T, R>(
  array: T[],
  concurrencyLimit: number,
  mapFn: MapFn<T, R>,
) {
  return async(array, concurrencyLimit, mapFn, promiseAllSettledResolver);
}
