import { asyncSettledPool } from '../src/async';

function delay(ms: number) {
  return new Promise<number>((res) => setTimeout(() => res(ms), ms));
}

test('with basic sample', async () => {
  const milliseconds = [100, 200, 300];
  for await (const result of asyncSettledPool(milliseconds, 2, delay)) {
    expect(result.status).toBe('fulfilled');
  }
});

test('with concurrency of 1', async () => {
  function fakeWriteToDB(name: string): Promise<string> {
    return new Promise<string>((res) =>
      setTimeout(() => res(name), Math.random() * 100),
    );
  }
  const names = ['Jerry', 'Mary', 'Richard', 'Alexis'];
  let i = 0;
  for await (const result of asyncSettledPool(names, 1, fakeWriteToDB)) {
    if (result.status === 'fulfilled') {
      expect(result.value).toBe(names[i]);
    } else fail('expected all to be fulfilled');

    i++;
  }
});

test('failing result does not throw', async () => {
  function determine(bool: boolean) {
    return new Promise<'pass' | 'fail'>((res, rej) => {
      if (bool) res('pass');
      else rej('fail');
    });
  }
  const passOrFails = [true, true, true, false, true, true, true]; // let `false` be a failing promise
  const results: string[] = [];
  let hasRejectedOnce = false;
  for await (const result of asyncSettledPool(passOrFails, 1, determine)) {
    if (result.status === 'rejected') {
      hasRejectedOnce = true;
      expect(result.reason).toBe('fail');
      results.push('fail');
    } else results.push('pass');
  }
  expect(results).toEqual([
    'pass',
    'pass',
    'pass',
    'fail',
    'pass',
    'pass',
    'pass',
  ]);
  if (!hasRejectedOnce) fail('Expected a rejection but did not receive one');
});
