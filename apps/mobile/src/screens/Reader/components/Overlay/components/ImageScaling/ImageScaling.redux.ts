import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState) => ({
  globalImageScaling: state.settings.reader.imageScaling,
});

const connector = connect(mapStateToProps);

export type ConnectedImageScalingProps = ConnectedProps<typeof connector>;

export default connector;
