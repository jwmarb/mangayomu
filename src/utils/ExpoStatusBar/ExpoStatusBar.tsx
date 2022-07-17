import React from 'react';
import connector, { ConnectedExpoStatusBarProps } from './ExpoStatusBar.redux';
import { StatusBar } from 'expo-status-bar';

const ExpoStatusBar: React.FC<ConnectedExpoStatusBarProps> = (props) => {
  const { style } = props;
  return <StatusBar style={style} />;
};

export default connector(React.memo(ExpoStatusBar));
