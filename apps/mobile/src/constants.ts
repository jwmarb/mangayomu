import { BACKEND_DOMAIN } from '@env';
import RNFetchBlob from 'rn-fetch-blob';
export const BACKEND_URL = `https://${BACKEND_DOMAIN}`;
export const IMAGE_CACHE_DIR = `${RNFetchBlob.fs.dirs.CacheDir}/images`;
export const READER_CACHE_DIR = `${RNFetchBlob.fs.dirs.CacheDir}/reader`;
