import React from 'react';
import connector, { ConnectedExpoStatusBarProps } from './ExpoStatusBar.redux';
import { StatusBar } from 'expo-status-bar';

const ExpoStatusBar: React.FC<ConnectedExpoStatusBarProps> = (props) => {
  const { style, show } = props;

  return <StatusBar style={style} backgroundColor='transparent' translucent hidden={!show} />;
};

export default connector(React.memo(ExpoStatusBar));
