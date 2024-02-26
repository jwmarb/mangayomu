export function promiseAllResolver<T>(arr: Promise<T>[]) {
  return Promise.all(arr);
}

export function promiseAllSettledResolver<T>(arr: Promise<T>[]) {
  return Promise.allSettled(arr);
}

export type MapFn<T, R> = (element: T, i: number, self: T[]) => Promise<R>;

export type ReduceFn<T, R> = (
  previous: R,
  current: T,
  i: number,
  self: T[],
) => Promise<R>;
