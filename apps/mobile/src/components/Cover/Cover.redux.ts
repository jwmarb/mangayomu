import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { CoverProps } from '@components/Cover/Cover.interfaces';

const mapStateToProps = (state: AppState, props: CoverProps) => ({
  ...props,
  coverHeight: state.settings.book.coverHeight,
  width: state.settings.book.width,
});

const connector = connect(mapStateToProps);

export type ConnectedCoverProps = ConnectedProps<typeof connector>;

export default connector;
