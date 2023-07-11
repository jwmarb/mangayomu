import { MangaHost } from '@mangayomu/mangascraper';

export default function getMangaHost(src: string) {
  const host = MangaHost.sourcesMap.get(src);
  if (host == null) throw new Error(`Invalid source ${src}`);
  return host;
}
