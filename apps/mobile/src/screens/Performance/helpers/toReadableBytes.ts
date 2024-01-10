const log1024 = Math.log(1024);

export default function toReadableBytes(size: number) {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / log1024);
  return (
    (size / Math.pow(1024, i)).toFixed(2) + ' ' + ['B', 'kB', 'MB', 'GB'][i]
  );
}
