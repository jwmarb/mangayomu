import { asyncMap } from '../src';

test('with basic sample', async () => {
  const sample = [1, 2, 3, 4, 5];
  function multiplyBy2(n: number): Promise<number> {
    return new Promise((res) => setTimeout(() => res(n << 1), 10));
  }

  const s = performance.now();
  const result = await asyncMap(sample, 1, multiplyBy2);
  const e = performance.now();
  expect(result).toEqual([2, 4, 6, 8, 10]);
  expect(e - s).toBeCloseTo(50, -2);
});

test('with concurrency of 5', async () => {
  const delays = [100, 200, 300, 100, 50, 90];
  function delay(n: number) {
    return new Promise<number>((res) => {
      const s = performance.now();
      setTimeout(() => res(performance.now() - s), n);
    });
  }

  const result = await asyncMap(delays, 5, delay);
  for (let i = 0; i < result.length; i++) {
    expect(result[i]).toBeCloseTo(delays[i], -2);
  }
});

test('with rejected promise', async () => {
  const passOrFails = [true, true, false, true, true];
  function assertPass(val: boolean) {
    return new Promise((res, rej) => {
      if (val) res('pass');
      else rej('failed');
    });
  }

  expect(asyncMap(passOrFails, 2, assertPass)).rejects.toEqual('failed');
});

test('with empty array', async () => {
  function a() {
    return Promise.reject();
  }
  expect(asyncMap([] as number[], 1000, a)).resolves.toEqual([]);
});
