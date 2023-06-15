import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { SnapPointsProps } from '@screens/Reader/components/Overlay/components/PageSliderNavigator/components/SnapPoints/SnapPoints.interfaces';
import { shouldHidePageNavigator } from '@screens/Reader/components/Overlay/components/PageSliderNavigator/PageSliderNavigator.helpers';

const mapStateToProps = (state: AppState, props: SnapPointsProps) => ({
  ...props,
  freeze: shouldHidePageNavigator(state),
});

const connector = connect(mapStateToProps);

export type ConnectedSnapPointsProps = ConnectedProps<typeof connector>;

export default connector;
