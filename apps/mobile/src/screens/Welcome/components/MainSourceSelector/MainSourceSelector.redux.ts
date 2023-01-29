import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState) => state.mainSourceSelector;

const connector = connect(mapStateToProps, null, null, { forwardRef: true });

export type ConnectedMainSourceSelectorProps = ConnectedProps<typeof connector>;

export default connector;
