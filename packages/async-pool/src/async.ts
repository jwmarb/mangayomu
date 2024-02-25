import { promiseAllResolver, promiseAllSettledResolver } from './resolvers';

export type AbstractAsyncResolver = <T, R, Result = Awaited<R>>(
  iterable: Iterable<T>,
  concurrencyLimit: number,
  asyncMapper: (element: T, index: number) => Promise<R>,
  resolver: (arr: Promise<R>[]) => Promise<Result[]>,
) => {
  [Symbol.asyncIterator]: () => AsyncGenerator<Result, void, unknown>;
};

export type AsyncResolver = <T, R>(
  iterable: Iterable<T>,
  concurrencyLimit: number,
  asyncMapper: (element: T, index: number) => Promise<R>,
) => {
  [Symbol.asyncIterator]: () => AsyncGenerator<Awaited<R>, void, unknown>;
};

export type AsyncSettledResolver = <T, R>(
  iterable: Iterable<T>,
  concurrencyLimit: number,
  asyncMapper: (element: T, index: number) => Promise<R>,
) => {
  [Symbol.asyncIterator]: () => AsyncGenerator<
    PromiseSettledResult<R>,
    void,
    unknown
  >;
};

const async: AbstractAsyncResolver = (
  iterable,
  concurrencyLimit,
  asyncMapper,
  resolver,
) => {
  return {
    [Symbol.asyncIterator]: async function* () {
      // keeps track of current index
      let n = 0;

      // keeps track where to "push" element in `pool`
      let r = 0;

      // the result when calling iterator.next()
      let result: IteratorResult<unknown>;

      // a fixed-sized array where all the promises shall be held
      const pool = new Array<Promise<unknown>>(concurrencyLimit);

      const iterator = iterable[Symbol.iterator]();

      while (!(result = iterator.next()).done) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pool[r] = asyncMapper(result.value as any, n);
        r = (r + 1) % concurrencyLimit;

        if (r === 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const resolvedArr = await resolver(pool as any);
          for (let i = 0; i < concurrencyLimit; i++) {
            yield resolvedArr[i];
          }
        }
        n++;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resolvedArr = await resolver(pool.slice(0, r) as any); // It is necessary to slice to not return old promises
      for (let i = 0; i < r; i++) {
        yield resolvedArr[i];
      }
    },
  };
};

/**
 * An asynchronous execution pool that is used in "for loops"
 * @param iterable An object that implements an iterator
 * @param concurrencyLimit The limit of the concurrency
 * @param asyncMapper A map function that processes an input and returns a promise
 * @returns Returns an object containing an asynchronous iterator that will iterate through each element with `n` steps,
 * which is based on `concurrencyLimit`
 */
export const asyncPool: AsyncResolver = (
  iterable,
  concurrencyLimit,
  asyncMapper,
) => async(iterable, concurrencyLimit, asyncMapper, promiseAllResolver);

/**
 * An asynchronous execution pool that is used in "for loops", however, each iteration is a `SettledPromiseResult`.
 * @param iterable An object that implements an iterator
 * @param concurrencyLimit The limit of the concurrency
 * @param asyncMapper A map function that processes an input and returns a promise
 * @returns Returns an object containing an asynchronous iterator that will iterate through each element with `n` steps,
 * which is based on `concurrencyLimit`
 */
export const asyncSettledPool: AsyncSettledResolver = (
  iterable,
  concurrencyLimit,
  asyncMapper,
) => async(iterable, concurrencyLimit, asyncMapper, promiseAllSettledResolver);
