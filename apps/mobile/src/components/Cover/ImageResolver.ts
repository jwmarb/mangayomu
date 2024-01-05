import Realm from 'realm';
import { LocalMangaSchema } from '@database/schemas/LocalManga';
import { ISOLangCode } from '@mangayomu/language-codes';
import {
  Manga,
  MangaChapter,
  MangaHost,
  MangaMeta,
} from '@mangayomu/mangascraper/src';

/**
 * A callback that is invoked upon successfully resolving an image uri
 */
export type ImageResolverListener = (uri: string | null) => void;

/**
 * The ImageResolver class handles image resolving. For each image that needs to be resolved, it manages all Promises that are resolving images
 * and prevents duplicate Promises resolving the same image. If there are three components that require a new image uri to be fetched, they will all reference to one single Promise instead of creating three separate Promises.
 */
export class ImageResolver {
  private localRealm: Realm;
  private user: Realm.User;
  private hostDefaultLanguage: ISOLangCode;
  private key: string;
  private resolver: () => Promise<Manga & MangaMeta<MangaChapter>>;
  private callbacks: Set<ImageResolverListener>;
  constructor(
    resolver: () => Promise<Manga & MangaMeta<MangaChapter>>,
    localRealm: Realm,
    user: Realm.User,
    hostDefaultLanguage: ISOLangCode,
    key: string,
  ) {
    this.localRealm = localRealm;
    this.resolver = resolver;
    this.callbacks = new Set();
    this.user = user;
    this.hostDefaultLanguage = hostDefaultLanguage;
    this.key = key;
  }

  /**
   *
   * @param resolver The resolver executor function to retrieve manga data
   * @param localRealm The realm containing local data
   * @param user The user of the cloud realm
   * @param hostDefaultLanguage The manga host's default langauge
   * @param key The key which is the manga link so that the `resolver` can be referenced instead of created, and for the resolver to be garbage-collected upon completion
   * @returns An instance of ImageResolver
   */
  static fetch(
    resolver: () => Promise<Manga & MangaMeta<MangaChapter>>,
    localRealm: Realm,
    user: Realm.User,
    hostDefaultLanguage: ISOLangCode,
    key: string,
  ) {
    const init = new ImageResolver(
      resolver,
      localRealm,
      user,
      hostDefaultLanguage,
      key,
    );
    init.getImage();
    pendingTasks.set(key, init);
    return init;
  }

  /**
   * Gets the image by fetching the manga. Various side effects occur upon retrieving manga data.
   */
  private async getImage() {
    try {
      const manga = await this.resolver();
      for (const callback of this.callbacks) {
        callback(manga.imageCover);
      }

      // Important to update locally
      this.localRealm.write(() => {
        const localManga = this.localRealm.objectForPrimaryKey(
          LocalMangaSchema,
          manga.link,
        );
        if (localManga != null) localManga.imageCover = manga.imageCover;
      });

      // Modifies the manga in the database
      this.user.functions.addSourceManga(manga, this.hostDefaultLanguage);

      pendingTasks.delete(this.key); // Allows the key to be garbage-collected, assuming that callbacks does not contain closures.
    } catch (e) {
      throw Error(`Failed to fetch manga.\n\n${e}`);
    }
  }
  /**
   * Creates a subscription for when the resolver finishes executing
   * @param callback The callback to be executed after getting a new image uri
   */
  subscribe(callback: ImageResolverListener) {
    this.callbacks.add(callback);
  }

  /**
   * Removes a subscription for when the resolver finishes executing. This should be called
   * in a cleanup function such as useEffect to prevent memory leaks
   * @param callback The callback to be executed after getting a new image uri
   */
  unsubscribe(callback: ImageResolverListener) {
    this.callbacks.delete(callback);
  }
}
const pendingTasks = new Map<string, ImageResolver>();

export function refetchImage(
  localRealm: Realm,
  manga: Manga,
  callback: ImageResolverListener,
  user: Realm.User,
) {
  let existingTask = pendingTasks.get(manga.link);

  const host = MangaHost.sourcesMap.get(manga.source);
  if (host == null) throw Error('Invalid manga source: ' + manga.source);
  if (existingTask == null)
    existingTask = ImageResolver.fetch(
      () => host.getMeta(manga),
      localRealm,
      user,
      host.defaultLanguage,
      manga.link,
    );

  existingTask.subscribe(callback);
  return existingTask;
}
