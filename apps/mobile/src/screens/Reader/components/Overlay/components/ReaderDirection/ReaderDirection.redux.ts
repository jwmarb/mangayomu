import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import React from 'react';
import { ReaderSettingProps } from '@screens/Reader/components/Overlay/Overlay.interfaces';
import { setGlobalReadingDirection } from '@redux/slices/settings';

const mapStateToProps = (state: AppState, props: ReaderSettingProps) => ({
  ...props,
  globalReadingDirection: state.settings.reader.readingDirection,
});

const connector = connect(mapStateToProps, { setGlobalReadingDirection });

export type ConnectedReaderDirectionProps = ConnectedProps<typeof connector>;

export default connector;
