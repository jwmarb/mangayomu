import { AppState } from '@redux/store';
import { MangaPreviewProps } from '@screens/Settings/screens/MangasColumn/components/MangaPreview/MangaPreview.interfaces';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState, props: MangaPreviewProps) => ({
  ...props,
  bold: state.settings.mangaCover.bold,
  coverStyle: state.settings.mangaCover.style,
});

const connector = connect(mapStateToProps);

export type ConnectedMangaPreviewProps = ConnectedProps<typeof connector>;

export default connector;
