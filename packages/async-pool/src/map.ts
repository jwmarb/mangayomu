import { promiseAllResolver, promiseAllSettledResolver } from './resolvers';

type AsyncMap = <T, R>(
  array: T[],
  concurrencyLimit: number,
  mapFn: (element: T, i: number, self: T[]) => Promise<R>,
) => Promise<Awaited<R>[]>;

type AsyncSettledMap = <T, R>(
  array: T[],
  concurrencyLimit: number,
  mapFn: (element: T, i: number, self: T[]) => Promise<R>,
) => Promise<PromiseSettledResult<Awaited<R>>[]>;

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

export const asyncMap: AsyncMap = (array, concurrencyLimit, mapFn) =>
  async(array, concurrencyLimit, mapFn, promiseAllResolver);
export const asyncSettledMap: AsyncSettledMap = (
  array,
  concurrencyLimit,
  mapFn,
) => async(array, concurrencyLimit, mapFn, promiseAllSettledResolver);
