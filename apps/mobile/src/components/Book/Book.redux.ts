import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { BookProps } from '@components/Book/Book.interfaces';

const mapStateToProps = (state: AppState, props: BookProps) => ({
  ...props,
  fontSize: state.settings.book.title.size,
  width: state.settings.book.width,
  height: state.settings.book.height,
  letterSpacing: state.settings.book.title.letterSpacing,
  bold: state.settings.book.title.bold,
  align: state.settings.book.title.alignment,
});

const connector = connect(mapStateToProps);

export type ConnectedBookProps = ConnectedProps<typeof connector>;

export default connector;
