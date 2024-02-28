import {
  ReaderScreenOrientation,
  setLockedDeviceOrientation,
} from '@redux/slices/settings';
import generateReaderSettingComponent from '@screens/Reader/components/Overlay/components/generateReaderSettingComponent';

export default generateReaderSettingComponent(
  'readerLockOrientation',
  'lockOrientation',
  setLockedDeviceOrientation,
  ReaderScreenOrientation,
  'Device orientation',
  'phone-rotate-portrait',
);
