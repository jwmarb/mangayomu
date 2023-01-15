import { AppState } from '@redux/store';
import { HeaderRightProps } from '@screens/MangaViewer/components/HeaderRight/HeaderRight.interfaces';
import { connect, ConnectedProps } from 'react-redux';
import { downloadSelected, cancelAllForSeries } from '@redux/reducers/mangaDownloadingReducer';
import { validateManga, prepareForValidation } from '@redux/reducers/mangaReducer';

const mapStateToProps = (state: AppState, props: HeaderRightProps) => ({
  ...props,
  chapters: state.mangas[props.manga.link]?.chapters,
  isDownloading: props.manga.link in state.downloading.mangas,
});

const connector = connect(mapStateToProps, {
  downloadSelected,
  cancelAllForSeries,
  validateManga,
  prepareForValidation,
});

export type ConnectedHeaderRightProps = ConnectedProps<typeof connector>;

export default connector;
