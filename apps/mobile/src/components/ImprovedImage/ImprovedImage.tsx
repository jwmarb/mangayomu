import {
  Image,
  ImageBackground,
  ImageProps,
  ImageRequireSource,
  ImageSourcePropType,
  ImageURISource,
} from 'react-native';
import RNFetchBlob, { FetchBlobResponse } from 'rn-fetch-blob';
import React from 'react';
import { IMAGE_CACHE_DIR } from '../../../App';
import { addSeconds, formatDistanceToNow, isAfter } from 'date-fns';

export interface ImprovedImageProps extends Omit<ImageProps, 'source'> {
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

const sync = new Map<string, Promise<FetchBlobResponse>>();

function sanitizeUri(uri: string): string {
  const parametersIndex = uri.indexOf('?');
  if (parametersIndex !== -1)
    return encodeURIComponent(uri.substring(0, parametersIndex));
  return encodeURIComponent(uri);
}

function toFSCacheURI(file: string): string {
  return `${IMAGE_CACHE_DIR}/${file}`;
}

function getOrCreateDownloadRequest(key: string, uri: string, stale?: boolean) {
  if (!stale) {
    const existingPromise = sync.get(key);
    if (existingPromise) return existingPromise;
  }
  const p = RNFetchBlob.config({ path: key }).fetch('GET', uri);
  sync.set(key, p);
  return p;
}

async function retrieveImageFromCache(
  uri: string,
  ttl: number,
): Promise<ImageSourcePropType> {
  const sanitizedUri = sanitizeUri(uri);
  const cacheUri = toFSCacheURI(sanitizedUri);
  const fileExists = await RNFetchBlob.fs.exists(cacheUri);
  if (fileExists) {
    // Check integrity of the file--that is, its TTL
    const { lastModified, filename } = await RNFetchBlob.fs.stat(cacheUri);
    const staleAtEpoch = addSeconds(lastModified, ttl);

    if (isAfter(Date.now(), staleAtEpoch)) {
      console.log(`${filename} is stale. Redownloading...`);
      const response = await getOrCreateDownloadRequest(cacheUri, uri, true);
      const fileExtension = cacheUri.substring(cacheUri.lastIndexOf('.') + 1);
      const base64 = `data:image/${fileExtension};base64,${response.base64()}`;
      return { uri: base64 };
    } else {
      const r = await RNFetchBlob.fs.readFile(cacheUri, 'base64');
      const fileExtension = sanitizedUri.substring(
        sanitizedUri.lastIndexOf('.') + 1,
      );
      const base64 = `data:image/${fileExtension};base64,${r}`;
      return { uri: base64 };
    }
  } else {
    const response = await getOrCreateDownloadRequest(cacheUri, uri);
    const fileExtension = cacheUri.substring(cacheUri.lastIndexOf('.') + 1);
    const base64 = `data:image/${fileExtension};base64,${response.base64()}`;
    return { uri: base64 };
  }
}

function useImageCaching(props: ImprovedImageProps) {
  const { source: src, cache = true, ttl = 259200, ...rest } = props;
  const [uri, setUri] = React.useState<ImageSourcePropType | undefined>(() => {
    if (!cache || typeof src === 'number') return src;

    return undefined;
  });
  React.useEffect(() => {
    if (cache)
      switch (typeof src) {
        case 'number':
          setUri(src);
          break;
        case 'object':
          if (src.uri != null)
            retrieveImageFromCache(src.uri, ttl).then(setUri);
          break;
      }
    else setUri(src);
  }, [typeof src === 'object' ? src.uri : src, ttl, cache]);
  return [uri, rest] as const;
}

export function ImprovedImageBackground(
  props: React.PropsWithChildren<ImprovedImageProps>,
) {
  const [uri, rest] = useImageCaching(props);
  return <ImageBackground source={uri} {...rest} />;
}

function ImprovedImage(
  props: ImprovedImageProps,
  ref: React.ForwardedRef<Image>,
) {
  const [uri, rest] = useImageCaching(props);
  return <Image ref={ref} source={uri} {...rest} />;
}

export default React.forwardRef(ImprovedImage);
