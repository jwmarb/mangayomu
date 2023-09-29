import { useManga } from '@app/(root)/[source]/[title]/[chapter]/context/MangaContext';
import Text from '@app/components/Text';
import ReaderOption from './readeroption';
import { MdImage, MdMenuBook, MdSearch } from 'react-icons/md';
import {
  ImageScaling,
  ReadingDirection,
  ZoomStartPosition,
} from '@mangayomu/schemas';
import useMangaSetting from '@app/(root)/[source]/[title]/[chapter]/hooks/useMangaSetting';

export default function ForSeries() {
  const manga = useManga();
  const [imageScaling, setImageScaling, UserImageScaling] = useMangaSetting(
    'readerImageScaling',
    ImageScaling,
  );
  const [readingDirection, setReadingDirection, UserReadingDirection] =
    useMangaSetting('readerDirection', ReadingDirection);
  const [zoomStartPosition, setZoomStartPosition, UserZoomStartPosition] =
    useMangaSetting('readerZoomStartPosition', ZoomStartPosition);

  return (
    <div className="py-2 px-4 bg-default h-full flex flex-col gap-2">
      <div>
        <Text variant="header">For this series</Text>
        <Text color="text-secondary" className="italic line-clamp-1">
          {manga.title}
        </Text>
      </div>
      <div>
        <ReaderOption
          first
          onChange={setImageScaling}
          top
          icon={<MdImage />}
          options={UserImageScaling}
          value={imageScaling}
          title="Image scaling"
        />
        <ReaderOption
          icon={<MdMenuBook />}
          onChange={setReadingDirection}
          top
          options={UserReadingDirection}
          value={readingDirection}
          title="Reading direction"
        />
        <ReaderOption
          onChange={setZoomStartPosition}
          top
          icon={<MdSearch />}
          options={UserZoomStartPosition}
          value={zoomStartPosition}
          title="Zoom start position"
          bottom
        />
      </div>
    </div>
  );
}
