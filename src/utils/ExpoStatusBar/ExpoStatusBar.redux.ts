import { AppState } from '@redux/store';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState, props: React.PropsWithChildren<{}>) => ({
  ...props,
  style: state.settings.statusBarStyle,
  show: state.reader.chapterInView == null,
});

const connector = connect(mapStateToProps);

export type ConnectedExpoStatusBarProps = ConnectedProps<typeof connector>;

export default connector;
