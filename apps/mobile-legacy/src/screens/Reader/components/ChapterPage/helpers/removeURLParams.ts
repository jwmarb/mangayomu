export default function removeURLParams(url: string) {
  const startParam = url.indexOf('?');
  if (startParam === -1) return url;
  return url.substring(0, startParam);
}
