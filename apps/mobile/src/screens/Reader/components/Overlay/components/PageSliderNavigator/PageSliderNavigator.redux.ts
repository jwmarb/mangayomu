import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import React from 'react';
import { PageSliderNavigatorProps } from '@screens/Reader/components/Overlay/components/PageSliderNavigator/PageSliderNavigator.interfaces';
import { shouldHidePageNavigator } from '@screens/Reader/components/Overlay/components/PageSliderNavigator/PageSliderNavigator.helpers';

const mapStateToProps = (
  state: AppState,
  props: React.PropsWithChildren<PageSliderNavigatorProps>,
) => ({
  ...props,
  hide: shouldHidePageNavigator(state),
});

const connector = connect(mapStateToProps, null, null, { forwardRef: true });

export type ConnectedPageSliderNavigatorProps = ConnectedProps<
  typeof connector
>;

export default connector;
