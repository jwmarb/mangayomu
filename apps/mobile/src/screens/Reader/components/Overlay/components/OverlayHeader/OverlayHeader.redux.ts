import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import React from 'react';
import { OverlayHeaderProps } from '@screens/Reader/components/Overlay/components/OverlayHeader/OverlayHeader.interfaces';

const mapStateToProps = (state: AppState, props: OverlayHeaderProps) => ({
  ...props,
});

const connector = connect(mapStateToProps);

export type ConnectedOverlayHeaderProps = ConnectedProps<typeof connector>;

export default connector;
