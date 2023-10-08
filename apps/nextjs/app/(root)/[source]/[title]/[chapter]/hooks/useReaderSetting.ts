import { useManga } from '@app/(root)/[source]/[title]/[chapter]/context/MangaContext';
import { ReaderSettings, useReaderSettings } from '@app/context/readersettings';
import useObject from '@app/hooks/useObject';
import MangaSchema from '@app/realm/Manga';
import {
  IMangaSchema,
  ISourceMangaSchema,
  ImageScaling,
  ReadingDirection,
  ZoomStartPosition,
} from '@mangayomu/schemas';

type ReaderSetting = Pick<
  IMangaSchema,
  'readerDirection' | 'readerImageScaling' | 'readerZoomStartPosition'
>;

const mapped: Record<keyof ReaderSetting, keyof ReaderSettings> = {
  readerDirection: 'readingDirection',
  readerImageScaling: 'imageScaling',
  readerZoomStartPosition: 'zoomStartPosition',
};

export default function useReaderSetting<T extends keyof ReaderSetting>(
  setting: T,
  manga: ISourceMangaSchema,
) {
  const userManga = useObject(MangaSchema, { link: manga.link });
  const globalSetting = useReaderSettings((s) => s[mapped[setting]]);
  return (userManga[setting] !== 'Use global setting'
    ? userManga[setting]
    : globalSetting) as unknown as T extends 'readerDirection'
    ? ReadingDirection
    : T extends 'readerImageScaling'
    ? ImageScaling
    : T extends 'readerZoomStartPosition'
    ? ZoomStartPosition
    : never;
}
