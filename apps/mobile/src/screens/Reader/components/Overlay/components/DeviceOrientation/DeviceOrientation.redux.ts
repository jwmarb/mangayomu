import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import React from 'react';
import { ReaderSettingProps } from '@screens/Reader/components/Overlay/Overlay.interfaces';
import { setLockedDeviceOrientation } from '@redux/slices/settings';

const mapStateToProps = (state: AppState, props: ReaderSettingProps) => ({
  ...props,
  lockOrientation: state.settings.reader.lockOrientation,
});

const connector = connect(mapStateToProps, { setLockedDeviceOrientation });

export type ConnectedDeviceOrientationProps = ConnectedProps<typeof connector>;

export default connector;
