export default function getFileExtension(url: string) {
  const found = url.match(/jpe?g|png|gif|bmp|webp/g);
  if (found == null) throw Error(`Unknown file extension. Input was ${url}`);
  return found[0];
}
