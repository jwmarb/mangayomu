import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { setReaderBackgroundColor } from '@redux/slices/settings';

const mapStateToProps = (state: AppState) => ({
  backgroundColor: state.settings.reader.backgroundColor,
});

const connector = connect(mapStateToProps, { setReaderBackgroundColor });

export type ConnectedBackgroundColorProps = ConnectedProps<typeof connector>;

export default connector;
