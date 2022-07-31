import { AppState } from '@redux/store';
import { ReaderSettingsProps } from '@screens/Reader/components/Overlay/components/ReaderSettings/ReaderSettings.interfaces';
import { connect, ConnectedProps } from 'react-redux';
import {
  changeReaderBackground,
  changeReaderDirection,
  toggleSkipChaptersMarkedRead,
  toggleKeepDeviceAwake,
  toggleShowPageNumber,
  setReaderScreenOrientation,
  setReaderScreenImageScaling,
  setReaderScreenZoomStartPosition,
} from '@redux/reducers/settingsReducer';
import * as readerSettingProfileActions from '@redux/reducers/readerSettingProfileReducer/';

const mapStateToProps = (state: AppState, props: ReaderSettingsProps) => ({
  ...props,
  settings: state.settings.reader,
  settingsForCurrentSeries: state.readerSetting[props.manga.link],
});

const connector = connect(mapStateToProps, {
  changeReaderBackground,
  changeReaderDirection,
  toggleSkipChaptersMarkedRead,
  toggleKeepDeviceAwake,
  toggleShowPageNumber,
  setReaderScreenOrientation,
  setReaderScreenImageScaling,
  setReaderScreenZoomStartPosition,
  ...readerSettingProfileActions,
});

export type ConnectedReaderSettingsProps = ConnectedProps<typeof connector>;

export default connector;
