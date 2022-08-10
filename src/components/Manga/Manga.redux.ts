import { MangaProps } from '@components/Manga/Manga.interface';
import { AppState } from '@redux/store';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState, props: MangaProps) => {
  const { perColumn, fontSize, bold, style } = state.settings.mangaCover;
  return {
    ...props,
    cols: perColumn,
    bold,
    fontSize,
    coverStyle: style,
    newChapters: state.mangas[props.link]?.newChapters as number | undefined,
  };
};

const connector = connect(mapStateToProps);

export type ConnectedMangaProps = ConnectedProps<typeof connector>;

export default connector;
