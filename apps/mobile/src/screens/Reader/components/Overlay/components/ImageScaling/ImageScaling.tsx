import { ImageScaling, setGlobalImageScaling } from '@redux/slices/settings';
import generateReaderSettingComponent from '@screens/Reader/components/Overlay/components/generateReaderSettingComponent';

export default generateReaderSettingComponent(
  'readerImageScaling',
  'imageScaling',
  setGlobalImageScaling,
  ImageScaling,
  'Image scaling',
  'image',
);
