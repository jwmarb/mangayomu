import { useRealm } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import { useAppDispatch } from '@redux/main';
import { ExtendedReaderPageState, setLocalPageURI } from '@redux/slices/reader';
import { useChapterPageContext } from '@screens/Reader/components/ChapterPage/context/ChapterPageContext';
import encodePathName from '@screens/Reader/components/ChapterPage/helpers/encodePathName';
import getFileExtension from '@screens/Reader/components/ChapterPage/helpers/getFileExtension';
import React from 'react';
import RNFetchBlob from 'rn-fetch-blob';

interface UsePageDownloaderArgs {
  extendedPageState?: ExtendedReaderPageState;
  pageKey: string;
  pageNumber: number;
  chapter: string;
}

export default function usePageDownloader(args: UsePageDownloaderArgs) {
  const { extendedPageState, pageKey, pageNumber, chapter } = args;
  const dispatch = useAppDispatch();
  const { sourceName, mangaTitle } = useChapterPageContext();
  const realm = useRealm();
  React.useEffect(() => {
    (async () => {
      if (
        extendedPageState &&
        extendedPageState.retries === 1 &&
        !extendedPageState.error
      ) {
        const fileExtension = getFileExtension(pageKey);
        /**
         * Download image locally
         */
        const path =
          RNFetchBlob.fs.dirs['CacheDir'] +
          '/' +
          sourceName +
          '/' +
          encodePathName(mangaTitle) +
          '/' +
          encodePathName(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            realm.objectForPrimaryKey(ChapterSchema, chapter)!.name,
          ) +
          '/' +
          pageNumber +
          `.${fileExtension}`;

        const base64 = `data:image/${fileExtension};base64,${await RNFetchBlob.config(
          {
            path,
          },
        )
          .fetch('GET', pageKey)
          .then((res) => res.base64() as string)}`;

        dispatch(setLocalPageURI({ pageKey, value: base64 }));
      }
    })();
  }, [extendedPageState?.retries, extendedPageState?.error]);
}
