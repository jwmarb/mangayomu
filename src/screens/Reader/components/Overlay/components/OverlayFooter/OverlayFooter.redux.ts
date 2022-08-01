import { AppState } from '@redux/store';
import { connect, ConnectedProps } from 'react-redux';
import React from 'react';
import * as ReaderSettingProfileReducerActions from '@redux/reducers/readerSettingProfileReducer';
import { OverlayFooterProps } from '@screens/Reader/components/Overlay/components/OverlayFooter/OverlayFooter.interfaces';
import { getOrUseGlobalSetting } from '@screens/Reader/components/Overlay/components/OverlayFooter/components/Selector.helpers';

const mapStateToProps = (state: AppState, props: React.PropsWithChildren<OverlayFooterProps>) => ({
  ...props,
  orientation: state.readerSetting[props.manga.link].orientation,
  imageScaling: state.readerSetting[props.manga.link].imageScaling,
  zoomStartPosition: state.readerSetting[props.manga.link].zoomStartPosition,
  readingDirection: state.readerSetting[props.manga.link].readingDirection
});

const connector = connect(mapStateToProps, ReaderSettingProfileReducerActions);

export type ConnectedOverlayFooterProps = ConnectedProps<typeof connector>;

export default connector;
