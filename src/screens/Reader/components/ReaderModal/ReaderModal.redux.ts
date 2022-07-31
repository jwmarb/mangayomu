import { AppState } from '@redux/store';
import { closeReaderModal } from '@redux/reducers/readerReducer';
import { connect, ConnectedProps } from 'react-redux';
import { ReaderModalProps } from '@screens/Reader/components/ReaderModal/ReaderModal.interfaces';

const mapStateToProps = (state: AppState, props: ReaderModalProps) => ({
  ...props,
  visible: state.reader.showModal,
  uri: state.reader.modalPageURI,
});

const connector = connect(mapStateToProps, { onClose: closeReaderModal });

export type ConnectedReaderModalProps = ConnectedProps<typeof connector>;

export default connector;
