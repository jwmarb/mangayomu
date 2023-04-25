import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { toggleImageModal } from '@redux/slices/reader';

const mapStateToProps = (state: AppState) => ({
  pageInDisplay: state.reader.pageInDisplay,
  show: state.reader.showImageModal,
});

const connector = connect(mapStateToProps, { toggleImageModal });

export type ConnectedImageMenuProps = ConnectedProps<typeof connector>;

export default connector;
