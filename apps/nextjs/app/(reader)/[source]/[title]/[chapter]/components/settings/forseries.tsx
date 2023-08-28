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

export default function ForSeries() {
  const manga = useManga();
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
          top
          icon={<MdImage />}
          options={ImageScaling}
          value={ImageScaling.SMART_FIT}
          title="Image scaling"
        />
        <ReaderOption
          icon={<MdMenuBook />}
          top
          options={ReadingDirection}
          value={ReadingDirection.RIGHT_TO_LEFT}
          title="Reading direction"
        />
        <ReaderOption
          top
          icon={<MdSearch />}
          options={ZoomStartPosition}
          value={ZoomStartPosition.AUTOMATIC}
          title="Zoom start position"
          bottom
        />
      </div>
    </div>
  );
}
