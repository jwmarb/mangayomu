import { asyncReduce } from '../src';
test('with basic sample', async () => {
  const parsed: number[] = [];
  function sum(prev: number, curr: number) {
    return new Promise<number>((res) =>
      setTimeout(() => {
        parsed.push(curr);
        res(prev + curr);
      }, 50),
    );
  }

  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const result = await asyncReduce(data, 0, sum);
  expect(result).toEqual(55);
  expect(parsed).toEqual(data);
});
