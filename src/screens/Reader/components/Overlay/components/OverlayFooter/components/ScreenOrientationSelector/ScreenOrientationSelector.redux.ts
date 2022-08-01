import { OverloadedSetting } from '@redux/reducers/readerSettingProfileReducer/readerSettingProfileReducer.constants';
import { AppState } from '@redux/store';
import { getOrUseGlobalSetting } from '@screens/Reader/components/Overlay/components/OverlayFooter/components/Selector.helpers';
import { SelectorProps } from '@screens/Reader/components/Overlay/components/OverlayFooter/components/Selector.interfaces';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState, props: SelectorProps) => ({
  ...props,
  orientation: getOrUseGlobalSetting(state, props.manga, 'orientation'),
});

const connector = connect(mapStateToProps);

export type ConnectedScreenOrientationSelectorProps = ConnectedProps<typeof connector>;

export default connector;
