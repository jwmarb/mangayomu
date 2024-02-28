export default function encodePathName(uri: string) {
  return uri.replace(/[^A-Za-z0-9\s-]/g, '');
}
