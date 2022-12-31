import { AppState } from '@redux/store';
import { OverlayProps } from '@screens/Reader/components/Overlay/Overlay.interfaces';
import { connect, ConnectedProps } from 'react-redux';
import { toggleLibrary, setIndexPage } from '@redux/reducers/mangaReducer/';
import { setOrientationForSeries } from '@redux/reducers/readerSettingProfileReducer';

const mapStateToProps = (state: AppState, props: OverlayProps) => ({
  ...props,
  show: state.reader.showOverlay,
  currentChapter: state.reader.chapterInView,
  inLibrary: props.manga.link in state.library.mangas,
  indexOffset: state.reader.chapterInView ? state.reader.chapterPositionOffset[state.reader.chapterInView.link] : 0,
  index: state.reader.index,
  numberOfPages: state.reader.chapterInView ? state.reader.numberOfPages[state.reader.chapterInView.link] : null,
  readerSetting: state.readerSetting[props.manga.link],
  showPageNumber: state.settings.reader.showPageNumber,
});

const connector = connect(mapStateToProps, { toggleLibrary, setIndexPage, setOrientationForSeries });

export type ConnectedOverlayProps = ConnectedProps<typeof connector>;

export default connector;
