import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState) => ({
  pageInDisplay: state.reader.pageInDisplay,
});

const connector = connect(mapStateToProps, undefined, undefined, {
  forwardRef: true,
});

export type ConnectedImageMenuProps = ConnectedProps<typeof connector>;

export default connector;
