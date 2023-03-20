import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import React from 'react';

const mapStateToProps = (state: AppState) => ({
  lockOrientation: state.settings.reader.lockOrientation,
});

const connector = connect(mapStateToProps);

export type ConnectedDeviceOrientationProps = ConnectedProps<typeof connector>;

export default connector;
