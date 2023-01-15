import { ModalProps } from '@components/Modal/Modal.interfaces';
import { AppState } from '@redux/store';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState, props: React.PropsWithChildren<ModalProps>) => ({
  ...props,
  statusBarHidden: state.reader.chapterInView != null,
});

const connector = connect(mapStateToProps);

export type ConnectedModalProps = ConnectedProps<typeof connector>;

export default connector;
