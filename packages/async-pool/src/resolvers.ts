export function promiseAllResolver<T>(arr: Promise<T>[]) {
  return Promise.all(arr);
}

export function promiseAllSettledResolver<T>(arr: Promise<T>[]) {
  return Promise.allSettled(arr);
}
