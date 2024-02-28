import { useLocalRealm, useRealm } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import { LocalChapterSchema } from '@database/schemas/LocalChapter';
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
  const localRealm = useLocalRealm();
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
            localRealm.objectForPrimaryKey(LocalChapterSchema, chapter)!.name,
          ) +
          '/' +
          pageNumber +
          `.${fileExtension}`;

        const uri = await RNFetchBlob.config({ path })
          .fetch('GET', pageKey)
          .then((res) => res.path());

        dispatch(setLocalPageURI({ pageKey, value: `file://${uri}` }));
      }
    })();
  }, [extendedPageState?.retries, extendedPageState?.error]);
}
