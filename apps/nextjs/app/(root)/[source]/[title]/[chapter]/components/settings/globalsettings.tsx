import Text from '@app/components/Text';
import ReaderOption from './readeroption';
import { MdImage, MdMenuBook, MdSearch } from 'react-icons/md';
import {
  ImageScaling,
  ReadingDirection,
  ZoomStartPosition,
} from '@mangayomu/schemas';
import { useReaderSettings } from '@app/context/readersettings';

export default function GloablSettings() {
  const {
    imageScaling,
    readingDirection,
    zoomStartPosition,
    setZoomStartPosition,
    setReadingDirection,
    setImageScaling,
  } = useReaderSettings();
  return (
    <div className="py-2 px-4 bg-default h-full flex flex-col gap-2">
      <div>
        <Text variant="header">Global</Text>
        <Text color="text-secondary">
          Settings that will apply to all mangas by default
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
