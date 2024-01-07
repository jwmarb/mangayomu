import { ImageCacheType } from '@redux/slices/settings';
import { IMAGE_CACHE_DIR } from 'env';

/**
 * Handles all memory caching based based on configuration
 */
export default class CacheManager {
  static memoryCache = new Set<string>();
  private readonly preset: ImageCacheType;

  public constructor(preset: ImageCacheType) {
    this.preset = preset;
  }

  public static using(preset: ImageCacheType) {
    return managers[preset];
  }

  public add(cacheUri: string) {
    if (this.preset === ImageCacheType.MEMORY)
      CacheManager.memoryCache.add(cacheUri);
  }
  public has(cacheUri: string): boolean {
    return (
      this.preset === ImageCacheType.MEMORY &&
      CacheManager.memoryCache.has(cacheUri)
    );
  }
  public toCacheUri(sanitizedUri: string) {
    return `${IMAGE_CACHE_DIR}/${sanitizedUri}`;
  }
}

/**
 * Holds single instances of CacheManager that can be reused
 */
const managers: Record<ImageCacheType, CacheManager> = {
  [ImageCacheType.DISK]: new CacheManager(ImageCacheType.DISK),
  [ImageCacheType.MEMORY]: new CacheManager(ImageCacheType.MEMORY),
};
