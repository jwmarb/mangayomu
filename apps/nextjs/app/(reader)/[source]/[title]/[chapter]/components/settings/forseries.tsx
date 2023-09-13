import { useManga } from '@app/(reader)/[source]/[title]/[chapter]/context/MangaContext';
import Text from '@app/components/Text';
import ReaderOption from './readeroption';
import { MdImage, MdMenuBook, MdSearch } from 'react-icons/md';
import {
  ImageScaling,
  ReadingDirection,
  ZoomStartPosition,
} from '@mangayomu/schemas';
import { Divider } from '@app/components/Divider';
import { useReaderSettings } from '@app/context/readersettings';

export default function ForSeries() {
  const manga = useManga();
  const {
    imageScaling,
    readingDirection,
    zoomStartPosition,
    setZoomStartPosition,
    setReadingDirection,
    setImageScaling,
  } = useReaderSettings();
  return (
    <div className="p-4 bg-default h-full flex flex-col gap-2">
      <div>
        <Text variant="header">For this series</Text>
        <Text color="text-secondary" className="italic">
          {manga.title}
        </Text>
      </div>
      <div>
        <ReaderOption
          first
          onChange={setImageScaling}
          top
          icon={<MdImage />}
          options={ImageScaling}
          value={imageScaling}
          title="Image scaling"
        />
        <ReaderOption
          icon={<MdMenuBook />}
          onChange={setReadingDirection}
          top
          options={ReadingDirection}
          value={readingDirection}
          title="Reading direction"
        />
        <ReaderOption
          onChange={setZoomStartPosition}
          top
          icon={<MdSearch />}
          options={ZoomStartPosition}
          value={zoomStartPosition}
          title="Zoom start position"
          bottom
        />
      </div>
    </div>
  );
}
