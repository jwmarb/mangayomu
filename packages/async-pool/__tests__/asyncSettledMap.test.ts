import { asyncSettledMap } from '../src';

test('rejected promise returns in settled result', async () => {
  const passOrFail = [false, false, false, false, true, true];
  function assertPass(n: boolean) {
    return new Promise<'pass' | 'fail'>((res, rej) => {
      if (n) res('pass');
      else rej('fail');
    });
  }

  const result = await asyncSettledMap(passOrFail, 1, assertPass);
  expect(
    result.map((x) => (x.status === 'fulfilled' ? x.value : x.reason)),
  ).toEqual(['fail', 'fail', 'fail', 'fail', 'pass', 'pass']);
});
