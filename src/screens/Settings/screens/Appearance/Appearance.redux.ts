import { AppState } from '@redux/store';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { changeAppTheme } from '@redux/reducers/settingsReducer';

const mapStateToProps = (state: AppState, props: React.PropsWithChildren<{}>) => ({
  ...props,
  theme: state.settings.theme,
});

const connector = connect(mapStateToProps, { changeAppTheme });

export type ConnectedAppearanceProps = ConnectedProps<typeof connector>;

export default connector;
