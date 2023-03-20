import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState) => ({
  globalZoomStartPosition: state.settings.reader.zoomStartPosition,
});

const connector = connect(mapStateToProps);

export type ConnectedZoomStartPositionProps = ConnectedProps<typeof connector>;

export default connector;
