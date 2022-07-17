import { AppState } from '@redux/store';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { changeAppTheme, changeFont } from '@redux/reducers/settingsReducer';

const mapStateToProps = (state: AppState, props: React.PropsWithChildren<{}>) => ({
  ...props,
  theme: state.settings.theme,
  fontFamily: state.settings.fontFamily.__selectedFont,
});

const connector = connect(mapStateToProps, { changeAppTheme, changeFont });

export type ConnectedAppearanceProps = ConnectedProps<typeof connector>;

export default connector;
