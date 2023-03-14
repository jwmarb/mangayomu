import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { OverlayProps } from './Overlay.interfaces';

const mapStateToProps = (state: AppState, props: OverlayProps) => ({
  ...props,
  showPageNumber: state.settings.reader.showPageNumber,
});

const connector = connect(mapStateToProps);

export type ConnectedOverlayProps = ConnectedProps<typeof connector>;

export default connector;
