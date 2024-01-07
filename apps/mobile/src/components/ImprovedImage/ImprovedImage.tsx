import {
  Image,
  ImageBackground,
  ImageProps,
  ImageRequireSource,
  ImageSourcePropType,
  ImageURISource,
  View,
} from 'react-native';
import RNFetchBlob, { FetchBlobResponse, StatefulPromise } from 'rn-fetch-blob';
import React, { useId } from 'react';
import { IMAGE_CACHE_DIR } from 'env';
import { addSeconds, isAfter } from 'date-fns';
import useAppSelector from '@hooks/useAppSelector';
import { ImageCacheType } from '@redux/slices/settings';
import CacheManager from '@components/ImprovedImage/CacheManager';

export interface ImprovedImageProps
  extends Omit<ImageProps, 'source' | 'onLoad'> {
  onLoad?: () => void;

  source?: ImageURISource | ImageRequireSource;
  /**
   * Enables image caching through disk
   * @default true
   */
  cache?: boolean;
  /**
   * The duration (in seconds) the image shall last in disk before it should be redownloaded. By default, cache is stale within 3 days
   * @default 259200
   */
  ttl?: number;
}

/**
 * Holds all Promises so that there are no duplicate Promises resolving for the same thing
 */
const sync = new Map<string, Promise<FetchBlobResponse>>();

function sanitizeUri(uri: string): string {
  const parametersIndex = uri.indexOf('?');
  const fileExtIdx = uri.lastIndexOf('.');
  const fileExt = uri.substring(
    fileExtIdx,
    parametersIndex === -1 ? undefined : parametersIndex,
  );

  return encodeURIComponent(
    uri.substring(0, fileExtIdx).replace(/[^a-zA-Z0-9]/g, '') + fileExt,
  );
}

function getOrCreateDownloadRequest(
  cacheUri: string,
  uri: string,
  stale?: boolean,
) {
  if (!stale) {
    const existingPromise = sync.get(cacheUri);
    if (existingPromise) return existingPromise;
  }
  return download(cacheUri, uri);
}
async function download(cacheUri: string, uri: string) {
  const result = RNFetchBlob.config({
    path: cacheUri,
    overwrite: true,
    timeout: 1000,
  }).fetch('GET', uri);
  sync.set(cacheUri, result); // Puts into map so that it can be referenced instead of creating new promises
  const awaitedResult = await result;
  sync.delete(cacheUri); // Once awaited, it is safe to delete this key
  if (awaitedResult.info().status !== 200) {
    await RNFetchBlob.fs.unlink(cacheUri);
    throw Error('Cannot download image from provided url');
  }
  return awaitedResult;
}

async function retrieveImageFromCache(
  uri: string,
  ttl: number,
): Promise<ImageSourcePropType> {
  const sanitizedUri = sanitizeUri(uri);
  const cacheUri = CacheManager.toCacheUri(sanitizedUri);
  if (CacheManager.has(sanitizedUri)) return { uri: `file://${cacheUri}` };

  // if it is downloading, we should use the existing Promise rather than the partially completed downloaded file...
  if (sync.has(cacheUri)) {
    const response = await getOrCreateDownloadRequest(cacheUri, uri);
    CacheManager.add(sanitizedUri);
    return { uri: `file://${response.path()}` };
  }
  const fileExists = await RNFetchBlob.fs.exists(cacheUri);
  if (fileExists) {
    // Check integrity of the file--that is, its TTL
    const { lastModified, filename } = await RNFetchBlob.fs.stat(cacheUri);
    const staleAtEpoch = addSeconds(lastModified, ttl);

    if (isAfter(Date.now(), staleAtEpoch)) {
      console.log(`${filename} is stale. Redownloading...`);
      const response = await getOrCreateDownloadRequest(cacheUri, uri, true);
      CacheManager.add(sanitizedUri);
      return { uri: `file://${response.path()}` };
    } else {
      CacheManager.add(sanitizedUri);
      return { uri: `file://${cacheUri}` };
    }
  } else {
    const response = await getOrCreateDownloadRequest(cacheUri, uri);
    CacheManager.add(sanitizedUri);
    return { uri: `file://${response.path()}` };
  }
}

function useImageCaching(props: ImprovedImageProps) {
  const _cacheEnabled = useAppSelector(
    (state) => state.settings.performance.imageCache.enabled,
  );
  const {
    source: src,
    cache = _cacheEnabled,
    ttl = 259200,
    onLoadEnd = () => void 0,
    onLoadStart = () => void 0,
    onError = () => void 0,
    ...rest
  } = props;

  function init() {
    if (!cache || typeof src === 'number') return src;
    if (src?.uri) {
      const sanitizedUri = sanitizeUri(src.uri);
      if (CacheManager.has(sanitizedUri))
        return { uri: `file://${CacheManager.toCacheUri(sanitizedUri)}` };
    }
    return undefined;
  }
  const [uri, setUri] = React.useState<ImageSourcePropType | undefined>(init);
  const prevSrc = React.useRef<typeof src>();
  const prevTtl = React.useRef<typeof ttl>();
  const prevCache = React.useRef<typeof cache>();
  if (
    (typeof prevSrc.current === 'object' &&
      typeof src === 'object' &&
      src?.uri !== prevSrc.current.uri) ||
    prevTtl.current !== ttl ||
    prevCache.current !== cache
  ) {
    setUri(init);
    if (cache)
      switch (typeof src) {
        case 'number':
          setUri(src);
          break;
        case 'object':
          if (src.uri) {
            const a = src.uri;
            onLoadStart();
            retrieveImageFromCache(a, ttl)
              .then((incomingUri) => {
                setUri((previousUri) => {
                  if (typeof previousUri === typeof incomingUri)
                    switch (typeof previousUri) {
                      case 'number':
                        return previousUri === incomingUri
                          ? previousUri
                          : incomingUri;
                      case 'object':
                        return (previousUri as ImageURISource).uri ===
                          (incomingUri as ImageURISource).uri
                          ? previousUri
                          : incomingUri;
                      default:
                        return incomingUri;
                    }
                  return incomingUri;
                });
              })
              .catch(onError)
              .finally(onLoadEnd);
          }
          break;
      }
    else setUri(src);
    prevSrc.current = src;
    prevTtl.current = ttl;
    prevCache.current = cache;
  }
  // React.useEffect(() => {
  //   if (cache)
  //     switch (typeof src) {
  //       case 'number':
  //         setUri(src);
  //         break;
  //       case 'object':
  //         if (src.uri != null) {
  //           onLoadStart();
  //           retrieveImageFromCache(src.uri, ttl)
  //             .then(setUri)
  //             .catch(onError)
  //             .finally(onLoadEnd);
  //         }
  //         break;
  //     }
  //   else setUri(src);
  // }, [typeof src === 'object' ? src.uri : src, ttl, cache]);

  if (
    (typeof src === 'object' && src.uri == null) ||
    typeof src === 'number' ||
    !cache
  ) {
    (rest as ImageProps).onError = onError;
    (rest as ImageProps).onLoadEnd = onLoadEnd;
    (rest as ImageProps).onLoadStart = onLoadStart;
  }
  return [uri, rest] as const;
}

export function ImprovedImageBackground(
  props: React.PropsWithChildren<ImprovedImageProps>,
) {
  const [uri, rest] = useImageCaching(props);
  const id = useId();
  if (uri == null) return <View key={id} {...rest} />;
  return <ImageBackground key={id} source={uri} {...rest} />;
}

function ImprovedImage(
  props: ImprovedImageProps,
  ref: React.ForwardedRef<Image>,
) {
  const [uri, rest] = useImageCaching(props);
  const id = useId();
  if (uri == null) return <View key={id} ref={ref} {...rest} />;
  return <Image key={id} ref={ref} source={uri} {...rest} />;
}

export default React.forwardRef(ImprovedImage);
