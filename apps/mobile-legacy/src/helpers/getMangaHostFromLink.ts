import { MangaHost } from '@mangayomu/mangascraper/src';

export default function getMangaHostFromLink(link: string) {
  const hostIterable = MangaHost.sourcesMap.values();
  let next = hostIterable.next();
  while (!next.done) {
    if (link.includes(next.value.link)) return next.value;
    next = hostIterable.next();
  }
  return null;
}
