import { AppDispatch } from '@redux/store';

export const cacheMangaCover = (uri: string, base64: string | null) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'CACHE_URI_TO_BASE64', uri, base64 });
  };
};
