import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { toggleShowPageNumber } from '@redux/slices/settings';

const mapStateToProps = (state: AppState) => ({
  showPageNumber: state.settings.reader.showPageNumber,
});

const connector = connect(mapStateToProps, { toggleShowPageNumber });

export type ConnectedShowPageNumberProps = ConnectedProps<typeof connector>;

export default connector;
