export type MangaCoverReducerState = Record<string, null | undefined | string>;

export type MangaCoverReducerActions =
  | {
      type: 'CACHE_URI_TO_BASE64';
      uri: string;
      base64: string | null;
    }
  | {
      type: 'DELETE_CACHED_COVER';
      uri: string;
    }
  | { type: 'DELETE_ALL_CACHED_COVERS' };
