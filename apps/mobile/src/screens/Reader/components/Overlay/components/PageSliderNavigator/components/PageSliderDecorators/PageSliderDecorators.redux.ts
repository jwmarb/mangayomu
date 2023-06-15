import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { shouldHidePageNavigator } from '@screens/Reader/components/Overlay/components/PageSliderNavigator/PageSliderNavigator.helpers';
import { PageSliderDecoratorsProps } from '@screens/Reader/components/Overlay/components/PageSliderNavigator/components/PageSliderDecorators/PageSliderDecorators.interfaces';

const mapStateToProps = (
  state: AppState,
  props: PageSliderDecoratorsProps,
) => ({
  ...props,
  hide: shouldHidePageNavigator(state),
});

const connector = connect(mapStateToProps);

export type ConnectedPageSliderDecoratorsProps = ConnectedProps<
  typeof connector
>;

export default connector;
