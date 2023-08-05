import {
  ReadingDirection,
  setGlobalReadingDirection,
} from '@redux/slices/settings';
import OverlayBottomButton from '@screens/Reader/components/Overlay/components/OverlayBottomButton';
import generateReaderSettingComponent from '@screens/Reader/components/Overlay/components/generateReaderSettingComponent';

export default generateReaderSettingComponent(
  'readerDirection',
  'readingDirection',
  setGlobalReadingDirection,
  ReadingDirection,
  'Reading direction',
  'book-open-variant',
);
