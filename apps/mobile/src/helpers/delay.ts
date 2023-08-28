export default function delay(executor: () => void, ms: number) {
  return new Promise<void>((res) => {
    setTimeout(() => {
      res();
      executor();
    }, ms);
  });
}
