import { AppState } from '@redux/store';
import { ScreenOrientationSelectorProps } from '@screens/Reader/components/Overlay/components/ScreenOrientationSelector/ScreenOrientationSelector.interfaces';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState, props: ScreenOrientationSelectorProps) => ({
  ...props,
  orientation: state.readerSetting[props.manga.link].orientation,
});

const connector = connect(mapStateToProps);

export type ConnectedScreenOrientationSelectorProps = ConnectedProps<typeof connector>;

export default connector;
