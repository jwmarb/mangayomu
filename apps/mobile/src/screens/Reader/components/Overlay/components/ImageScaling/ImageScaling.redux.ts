import { AppState } from '@redux/main';
import { ReaderSettingProps } from '@screens/Reader/components/Overlay/Overlay.interfaces';
import { connect, ConnectedProps } from 'react-redux';
import { setGlobalImageScaling } from '@redux/slices/settings';

const mapStateToProps = (state: AppState, props: ReaderSettingProps) => ({
  ...props,
  globalImageScaling: state.settings.reader.imageScaling,
});

const connector = connect(mapStateToProps, { setGlobalImageScaling });

export type ConnectedImageScalingProps = ConnectedProps<typeof connector>;

export default connector;
