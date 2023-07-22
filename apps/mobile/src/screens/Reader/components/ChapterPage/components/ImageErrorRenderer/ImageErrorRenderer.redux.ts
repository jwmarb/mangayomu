import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import React from 'react';
import { ImageErrorRendererProps } from './';

const mapStateToProps = (
  state: AppState,
  props: React.PropsWithChildren<ImageErrorRendererProps>,
) => ({
  ...props,
  backgroundColor: state.settings.reader.backgroundColor,
});

const connector = connect(mapStateToProps);

export type ConnectedImageErrorRendererProps = ConnectedProps<typeof connector>;

export default connector;
