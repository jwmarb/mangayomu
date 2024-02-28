import {
  ZoomStartPosition as EnumZoomStartPosition,
  setGlobalZoomStartPosition,
} from '@redux/slices/settings';
import generateReaderSettingComponent from '@screens/Reader/components/Overlay/components/generateReaderSettingComponent';

export default generateReaderSettingComponent(
  'readerZoomStartPosition',
  'zoomStartPosition',
  setGlobalZoomStartPosition,
  EnumZoomStartPosition,
  'Zoom start position',
  'magnify',
);
