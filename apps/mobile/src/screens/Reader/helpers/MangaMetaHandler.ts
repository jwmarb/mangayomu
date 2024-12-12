import useMangaMeta from '@/screens/MangaView/hooks/useMangaMeta';
import { MangaMeta } from '@mangayomu/mangascraper';

/**
 *  The MangaMetaHandler class is responsible for managing and handling metadata of manga.
 */
class MangaMetaHandler {
  private tmangameta: unknown;
  private meta: MangaMeta | null;

  public constructor() {
    this.tmangameta = null;
    this.meta = null;
  }

  public setMangaMeta(meta: ReturnType<typeof useMangaMeta>['data']) {
    if (meta) {
      this.tmangameta = meta[0];
      this.meta = meta[1];
    }
  }

  public getTMangaMeta() {
    return this.tmangameta;
  }

  public getMangaMeta() {
    return this.meta;
  }

  public cleanup() {
    this.tmangameta = null;
    this.meta = null;
  }
}

export default new MangaMetaHandler();
