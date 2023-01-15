import { AppState } from '@redux/store';
import { PageProps } from '@screens/Reader/components/Page/Page.interfaces';
import { connect, ConnectedProps } from 'react-redux';
import {
  setShouldActivateOnStart,
  setCurrentlyReadingChapter,
  toggleOverlay,
  openReaderModal,
} from '@redux/reducers/readerReducer';
import { OverloadedSetting } from '@redux/reducers/readerSettingProfileReducer/readerSettingProfileReducer.constants';
import { ReaderDirection } from '@redux/reducers/settingsReducer/settingsReducer.constants';
import { SavePageInfo } from '@redux/reducers/readerReducer/readerReducer.interfaces';

const mapStateToProps = (state: AppState, props: PageProps) => ({
  manga: state.mangas[props.manga.link],
  chapter: props.chapter,
  uri: props.uri,
  isOfFirstChapter: props.isOfFirstChapter,
  width: props.width,
  height: props.height,
  shouldTrackIndex: state.reader.shouldTrackIndex,
  readerDirection: (state.readerSetting[props.manga.link].readingDirection === OverloadedSetting.AUTO ||
  state.readerSetting[props.manga.link].readingDirection == null
    ? state.settings.reader._global.readingDirection
    : state.readerSetting[props.manga.link].readingDirection) as ReaderDirection,
  deviceOrientation: state.settings.deviceOrientation,
  imageScaling:
    state.readerSetting[props.manga.link].imageScaling === OverloadedSetting.AUTO
      ? state.settings.reader._global.imageScaling
      : state.readerSetting[props.manga.link].imageScaling,
  zoomStartPosition:
    state.readerSetting[props.manga.link].zoomStartPosition === OverloadedSetting.AUTO
      ? state.settings.reader._global.zoomStartPosition
      : state.readerSetting[props.manga.link].zoomStartPosition,
});

const connector = connect(mapStateToProps, { setShouldActivateOnStart, toggleOverlay, openReaderModal });

export type ConnectedPageProps = ConnectedProps<typeof connector>;

export default connector;
