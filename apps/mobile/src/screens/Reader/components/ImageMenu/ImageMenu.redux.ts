import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { toggleImageModal } from '@redux/slices/reader';

const mapStateToProps = (state: AppState) => ({
  show: state.reader.showImageModal,
});

const connector = connect(mapStateToProps, { toggleImageModal }, null, {
  forwardRef: true,
});

export type ConnectedImageMenuProps = ConnectedProps<typeof connector>;

export default connector;
