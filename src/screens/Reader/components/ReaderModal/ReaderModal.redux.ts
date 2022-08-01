import { AppState } from '@redux/store';
import { closeReaderModal } from '@redux/reducers/readerReducer';
import { connect, ConnectedProps } from 'react-redux';
import { ReaderModalProps } from '@screens/Reader/components/ReaderModal/ReaderModal.interfaces';

const mapStateToProps = (state: AppState, props: ReaderModalProps) => ({
  ...props,
  visible: state.reader.showModal,
  page: state.reader.modalPageURI,
  pageNumber: state.reader.chapterInView
    ? state.reader.index - state.reader.chapterPositionOffset[state.reader.chapterInView.link]
    : 0,
});

const connector = connect(mapStateToProps, { onClose: closeReaderModal });

export type ConnectedReaderModalProps = ConnectedProps<typeof connector>;

export default connector;
