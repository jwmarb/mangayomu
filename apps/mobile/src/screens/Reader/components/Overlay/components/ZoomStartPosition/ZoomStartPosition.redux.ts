import { AppState } from '@redux/main';
import { ReaderSettingProps } from '@screens/Reader/components/Overlay/Overlay.interfaces';
import { connect, ConnectedProps } from 'react-redux';
import { setGlobalZoomStartPosition } from '@redux/slices/settings';

const mapStateToProps = (state: AppState, props: ReaderSettingProps) => ({
  ...props,
  globalZoomStartPosition: state.settings.reader.zoomStartPosition,
});

const connector = connect(mapStateToProps, { setGlobalZoomStartPosition });

export type ConnectedZoomStartPositionProps = ConnectedProps<typeof connector>;

export default connector;
