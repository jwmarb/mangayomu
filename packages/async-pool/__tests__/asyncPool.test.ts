import { asyncPool } from '../src';

function delay(ms: number) {
  return new Promise<number>((res) => setTimeout(() => res(ms), ms));
}

test('with basic sample', async () => {
  let i = 0;
  const milliseconds = [100, 200, 300];
  const assertionResults: number[] = [];
  for await (const result of asyncPool(milliseconds, 2, delay)) {
    expect(result).toEqual(milliseconds[i]);
    assertionResults.push(result);
    i++;
  }
  expect(assertionResults).toEqual(milliseconds);
});

test('with empty array', async () => {
  for await (const result of asyncPool([] as number[], 2, delay)) {
    fail(`Returned ${result} when input is an empty array`);
  }
});

test('with concurrency of 1', async () => {
  function fakeWriteToDB(name: string): Promise<string> {
    return new Promise<string>((res) =>
      setTimeout(() => res(name), Math.random() * 100),
    );
  }
  const names = ['Jerry', 'Mary', 'Richard', 'Alexis'];
  const results: string[] = [];
  let i = 0;
  for await (const result of asyncPool(names, 1, fakeWriteToDB)) {
    expect(result).toBe(names[i]);
    results.push(result);
    i++;
  }
  expect(results).toEqual(names);
});

test('with concurrency of 5', async () => {
  function fakeWriteToDB(name: string): Promise<string> {
    return new Promise<string>((res) =>
      setTimeout(() => res(name), Math.random() * 100),
    );
  }
  const names = ['Jerry', 'Mary', 'Richard', 'Alexis'];
  const results: string[] = [];
  let i = 0;
  for await (const result of asyncPool(names, 5, fakeWriteToDB)) {
    expect(result).toBe(names[i]);
    results.push(result);
    i++;
  }
  expect(results).toEqual(names);
});

test('with concurrency with leftover', async () => {
  const arr = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];
  function withSomeDelay(n: number) {
    return new Promise<number>((res) => setTimeout(() => res(n), 25));
  }
  let sum = 0;
  for await (const result of asyncPool(arr, 6, withSomeDelay)) {
    sum += result;
  }
  expect(sum).toBe((20 * (1 + 20)) / 2);
});

test('throws when at least one error', async () => {
  function determine(bool: boolean) {
    return new Promise<boolean>((res, rej) => {
      if (bool) res(bool);
      else rej('rejected');
    });
  }
  const passOrFails = [true, true, true, false, true, true]; // let `false` be a failing promise
  try {
    for await (const result of asyncPool(passOrFails, 1, determine)) {
      if (!result)
        fail(
          'This should have thrown an error instead of returning this result',
        );
    }
  } catch (e) {
    expect(e).toBe('rejected');
  }
});
