import { store } from '@redux/main';
import { ImageCacheType } from '@redux/slices/settings';
import { IMAGE_CACHE_DIR } from 'env';

/**
 * Handles all memory caching based based on configuration
 */
export default class CacheManager {
  static memoryCache = new Set<string>();
  private static preset: ImageCacheType;

  public static using(preset: ImageCacheType) {
    if (preset === ImageCacheType.DISK) this.memoryCache.clear();
    this.preset = preset;
  }

  public static initialize() {
    this.preset = store.getState().settings.performance.imageCache.type;
  }

  public static add(cacheUri: string) {
    if (CacheManager.preset === ImageCacheType.MEMORY)
      CacheManager.memoryCache.add(cacheUri);
  }
  public static has(cacheUri: string): boolean {
    return (
      CacheManager.preset === ImageCacheType.MEMORY &&
      CacheManager.memoryCache.has(cacheUri)
    );
  }
  public static toCacheUri(sanitizedUri: string) {
    return `${IMAGE_CACHE_DIR}/${sanitizedUri}`;
  }
}
